import type { RequestHandler } from "express";
import Stripe from "stripe";
import { PRODUCTS, MERCH_PRODUCTS, VOUCHERS, DELIVERY_COST } from "../../shared/products";

const stripeKey = process.env.STRIPE_SECRET_KEY;

// Initialize Stripe with error handling
let stripe: Stripe | null = null;
if (stripeKey) {
  try {
    stripe = new Stripe(stripeKey);
    console.log("[Stripe] Initialized successfully");
  } catch (err) {
    console.error("[Stripe] Failed to initialize:", err);
  }
}

// Combine all products for lookups
const ALL_PRODUCTS = [...PRODUCTS, ...MERCH_PRODUCTS];

// Calculate total server-side to prevent tampering
function calculateTotal(
  items: Array<{ id: string; quantity: number }>,
  voucherCode?: string,
) {
  // Validate and calculate subtotal from actual product prices
  const subtotal = items.reduce((sum, { id, quantity }) => {
    const product = ALL_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error(`Invalid product ID: ${id}`);
    return sum + product.price * quantity;
  }, 0);

  // Apply voucher if valid (discounts apply to products, not delivery)
  const voucher = VOUCHERS.find((v) => v.code === voucherCode);
  let discount = 0;
  if (voucher) {
    discount =
      voucher.type === "percentage"
        ? subtotal * (voucher.discount / 100)
        : voucher.discount;
  }

  // Add delivery cost (fixed amount, not subject to discounts)
  const delivery = DELIVERY_COST;

  return {
    subtotal,
    discount,
    delivery,
    total: Math.max(0, subtotal - discount + delivery),
  };
}

export const handleStripeCheckout: RequestHandler = async (req, res) => {
  console.log("[Stripe] handleStripeCheckout called");
  console.log("[Stripe] Request body:", req.body);

  try {
    // Validate Stripe is configured with a real key
    if (!stripe || !stripeKey) {
      console.error(
        "[Stripe] Not configured - stripe:",
        !!stripe,
        "key:",
        !!stripeKey,
      );
      return res.status(400).json({
        error: "Stripe is not configured. Please contact support.",
      });
    }

    console.log("[Stripe] Received checkout request");
    const { items, voucherCode, customerData, orderNumber } = req.body;
    console.log("[Stripe] Items received:", items);
    console.log("[Stripe] Voucher code:", voucherCode);
    console.log("[Stripe] Customer data received:", customerData);
    console.log("[Stripe] Order number received:", orderNumber);

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("[Stripe] Invalid items:", items);
      return res.status(400).json({ error: "Invalid items array" });
    }

    console.log("[Stripe] Processing items:", items.length);

    // Validate all items and build line items
    const line_items = items.map(({ id, quantity }) => {
      const product = ALL_PRODUCTS.find((p) => p.id === id);
      if (!product) {
        throw new Error(`Product not found: ${id}`);
      }
      if (!quantity || quantity < 1) {
        throw new Error(`Invalid quantity for product ${id}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      };
    });

    // Add delivery charge as a line item
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery (2 weeks)",
          description: "Standard worldwide shipping - delivery within 2 weeks",
        },
        unit_amount: Math.round(DELIVERY_COST * 100),
      },
      quantity: 1,
    });

    console.log("[Stripe] Built line items:", line_items.length);

    // Calculate totals server-side
    const totals = calculateTotal(items, voucherCode);
    console.log("[Stripe] Calculated totals:", totals);

    // Create coupon if voucher is valid (optional - skip if fails)
    let couponId: string | undefined;
    if (voucherCode) {
      const voucher = VOUCHERS.find((v) => v.code === voucherCode);
      if (voucher) {
        try {
          console.log("[Stripe] Creating coupon for voucher:", voucherCode);
          const coupon = await stripe.coupons.create({
            amount_off: Math.round(totals.discount * 100),
            currency: "usd",
            duration: "once",
            name: `VOUCHER_${Date.now()}`,
          });
          couponId = coupon.id;
          console.log("[Stripe] Coupon created:", couponId);
        } catch (couponErr: any) {
          console.warn("[Stripe] Coupon creation failed:", couponErr.message);
        }
      }
    }

    // Build redirect URLs dynamically based on request origin
    const protocol = req.protocol || "https";
    const host = req.get("host") || "www.burnitdownyt.com";
    const baseUrl = `${protocol}://${host}`;

    console.log("[Stripe] Building URLs with baseUrl:", baseUrl);
    const success_url = `${baseUrl}/bill?provider=stripe&session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${baseUrl}/checkout?cancelled=true`;

    console.log("[Stripe] Success URL:", success_url);
    console.log("[Stripe] Cancel URL:", cancel_url);

    // Create customer with basic info (email, name, phone)
    let customerId: string | undefined;
    if (customerData?.email && stripe) {
      try {
        console.log(
          "[Stripe] Creating customer for email:",
          customerData.email,
        );
        const customer = await stripe.customers.create({
          email: customerData.email,
          name: customerData.name || undefined,
          phone: customerData.phone || undefined,
          metadata: {
            orderNumber: orderNumber || "",
          },
        });
        customerId = customer.id;
        console.log("[Stripe] Customer created:", customerId);
      } catch (customerErr: any) {
        console.warn("[Stripe] Customer creation failed:", customerErr.message);
      }
    }

    // Create Stripe checkout session
    // Address collection is handled by Stripe's built-in form
    console.log("[Stripe] Creating checkout session");
    const sessionParams: any = {
      mode: "payment",
      payment_method_types: ["card", "apple_pay"],
      line_items,
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      success_url,
      cancel_url,
      customer: customerId || undefined,
      customer_email: !customerId
        ? customerData?.email || undefined
        : undefined,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW", "ZZ"],
      },
      metadata: {
        orderNumber: orderNumber || "",
        voucherCode: voucherCode || "",
        itemCount: items.length.toString(),
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("[Stripe] Session created:", session.id);

    if (!session.url) {
      console.error("[Stripe] No URL in session");
      throw new Error("Stripe session created but no URL returned");
    }

    console.log("[Stripe] Returning checkout URL");
    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[Stripe] Checkout error:", {
      message: err.message,
      type: err.type,
      statusCode: err.statusCode,
    });

    let errorMsg = "Payment processing failed";
    if (err.type === "StripeInvalidRequestError") {
      errorMsg = err.message || "Invalid payment details";
    } else if (err.message?.includes("line_items")) {
      errorMsg = "Invalid product information";
    }

    res.status(400).json({ error: errorMsg });
  }
};

export const handleStripeVerify: RequestHandler = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: "Payment provider not configured" });
    }

    const session_id = req.query.session_id as string;
    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify payment was successful
    const paid =
      session.payment_status === "paid" && session.status === "complete";

    res.json({ paid, session });
  } catch (err: any) {
    console.error("[Stripe] Verify error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
