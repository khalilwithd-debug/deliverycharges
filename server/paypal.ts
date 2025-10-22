import type { RequestHandler } from "express";
import { PRODUCTS, MERCH_PRODUCTS, VOUCHERS, DELIVERY_COST } from "../../shared/products";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Determine if using sandbox or live based on client ID
// Sandbox Client IDs typically contain "sb_" or "AX" patterns
// Live Client IDs are much longer and don't have "sb_"
const isSandbox = (clientId: string | undefined): boolean => {
  if (!clientId) return true; // Default to sandbox if not set
  // Sandbox IDs are typically shorter and contain patterns like "sb_" or "AX"
  // Live IDs are typically 80+ characters
  return clientId.length < 60 || clientId.includes("sb_");
};

const PAYPAL_API_BASE = isSandbox(PAYPAL_CLIENT_ID)
  ? "https://api.sandbox.paypal.com"
  : "https://api.paypal.com";

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getPayPalAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
    ).toString("base64");

    const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      throw new Error(
        `PayPal token request failed: ${tokenResponse.statusText}`,
      );
    }

    const tokenData = await tokenResponse.json();
    accessToken = tokenData.access_token;
    tokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000;

    console.log("[PayPal] Access token obtained successfully");
    return accessToken;
  } catch (err: any) {
    console.error("[PayPal] Failed to get access token:", err.message);
    throw err;
  }
}

if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
  console.log("[PayPal] Initialized successfully with new SDK");
} else {
  console.error("[PayPal] Missing PayPal credentials");
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
    const p = ALL_PRODUCTS.find((prod) => prod.id === id);
    if (!p) throw new Error(`Invalid product ID: ${id}`);
    return sum + p.price * quantity;
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

export const handlePayPalCheckout: RequestHandler = async (req, res) => {
  console.log("[PayPal] handlePayPalCheckout called");
  console.log("[PayPal] Request body:", req.body);

  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error("[PayPal] Credentials not configured");
      return res.status(400).json({
        error: "PayPal is not configured. Please contact support.",
      });
    }

    const { items, voucherCode, customerData, orderNumber } = req.body;
    console.log("[PayPal] Items received:", items);
    console.log("[PayPal] Voucher code:", voucherCode);
    console.log("[PayPal] Customer data received:", customerData);
    console.log("[PayPal] Order number received:", orderNumber);

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("[PayPal] Invalid items:", items);
      return res.status(400).json({ error: "Invalid items array" });
    }

    console.log("[PayPal] Processing items:", items.length);

    // Validate all items exist
    for (const item of items) {
      const product = ALL_PRODUCTS.find((p) => p.id === item.id);
      if (!product) throw new Error(`Product not found: ${item.id}`);
      if (item.quantity < 1) throw new Error("Invalid quantity");
    }

    // Calculate total server-side
    const totals = calculateTotal(items, voucherCode);
    console.log("[PayPal] Calculated totals:", totals);

    // Build item list for PayPal
    const itemList = items.map((item) => {
      const product = ALL_PRODUCTS.find((p) => p.id === item.id);
      return {
        name: product?.name || `Item ${item.id}`,
        unit_amount: {
          currency_code: "USD",
          value: (product?.price || 0).toFixed(2),
        },
        quantity: item.quantity.toString(),
        category: "PHYSICAL_GOODS",
      };
    });

    // Add delivery charge as a line item
    itemList.push({
      name: "Delivery (2 weeks)",
      description: "Standard worldwide shipping - delivery within 2 weeks",
      unit_amount: {
        currency_code: "USD",
        value: DELIVERY_COST.toFixed(2),
      },
      quantity: "1",
      category: "PHYSICAL_GOODS",
    });

    console.log("[PayPal] Item list:", itemList);

    // Use provided order number or generate one
    const finalOrderNumber =
      orderNumber || `WWE-${Date.now().toString().slice(-6)}`;

    // Build redirect URLs dynamically based on request origin
    const protocol = req.protocol || "https";
    const host = req.get("host") || "www.burnitdownyt.com";
    const baseUrl = `${protocol}://${host}`;

    console.log("[PayPal] Building URLs with baseUrl:", baseUrl);
    console.log("[PayPal] Final order number:", finalOrderNumber);

    // Create order with items marked as PHYSICAL_GOODS to trigger shipping collection
    // Use GET_FROM_FILE shipping preference so PayPal collects the address
    const orderPayload = {
      intent: "CAPTURE" as const,
      purchase_units: [
        {
          reference_id: finalOrderNumber,
          items: itemList,
          amount: {
            currency_code: "USD",
            value: totals.total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totals.subtotal.toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: totals.delivery.toFixed(2),
              },
              ...(totals.discount > 0 && {
                discount: {
                  currency_code: "USD",
                  value: totals.discount.toFixed(2),
                },
              }),
            },
          },
        },
      ],
      application_context: {
        return_url: `${baseUrl}/bill?provider=paypal&orderId=${finalOrderNumber}`,
        cancel_url: `${baseUrl}/checkout?cancelled=true`,
        brand_name: "BURNITDOWNYT",
        locale: "en-US",
        user_action: "PAY_NOW",
        shipping_preference: "GET_FROM_FILE",
      },
    };

    console.log("[PayPal] Creating order with payload:", JSON.stringify(orderPayload, null, 2));

    let order;
    try {
      const token = await getPayPalAccessToken();
      console.log("[PayPal] Using access token for order creation");

      const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": finalOrderNumber,
        },
        body: JSON.stringify(orderPayload),
      });

      console.log("[PayPal] Order response status:", orderResponse.status);

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error(
          "[PayPal] Order creation failed:",
          orderResponse.status,
          errorText,
        );
        // Try to parse error details
        let errorDetail = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          console.error("[PayPal] Error details:", errorJson);
          errorDetail = errorJson.message || errorJson.error_description || errorText;
        } catch (e) {
          // errorText is not JSON
        }
        throw new Error(`PayPal API error: ${errorDetail}`);
      }

      order = await orderResponse.json();
      console.log("[PayPal] Order created:", order.id);
      console.log("[PayPal] Order status:", order.status);
      console.log("[PayPal] Order links:", order.links);
    } catch (executeErr: any) {
      console.error("[PayPal] Execute error:", {
        message: executeErr.message,
      });
      throw executeErr;
    }

    const approveLink = (order?.links || []).find(
      (l: any) => l.rel === "approve",
    );
    const approveUrl = approveLink?.href;

    if (!approveUrl) {
      console.error(
        "[PayPal] No approve URL in response. Order:",
        JSON.stringify(order, null, 2),
      );
      throw new Error("No approve URL in PayPal response");
    }

    console.log("[PayPal] Returning approve URL");
    res.json({ approveUrl, orderId: order.id });
  } catch (err: any) {
    console.error("[PayPal] Checkout error:", {
      message: err.message,
      statusCode: err.statusCode,
      body: err.body,
    });
    res
      .status(400)
      .json({ error: err.message || "PayPal order creation failed" });
  }
};

export const handlePayPalCapture: RequestHandler = async (req, res) => {
  console.log("[PayPal] handlePayPalCapture called");

  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error("[PayPal] Credentials not configured");
      return res.status(400).json({ error: "PayPal is not configured" });
    }

    const { orderId } = req.query;

    if (!orderId || typeof orderId !== "string") {
      console.error("[PayPal] Missing orderId");
      return res.status(400).json({ error: "Missing orderId" });
    }

    console.log("[PayPal] Capturing order:", orderId);
    try {
      const token = await getPayPalAccessToken();
      const captureResponse = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      if (!captureResponse.ok) {
        const errorText = await captureResponse.text();
        console.error(
          "[PayPal] Order capture failed:",
          captureResponse.status,
          errorText,
        );
        throw new Error(`PayPal order capture failed: ${errorText}`);
      }

      const order = await captureResponse.json();
      console.log("[PayPal] Order captured:", order.id);
      console.log("[PayPal] Order status:", order.status);

      const paid = order.status === "COMPLETED";

      res.json({ paid, order });
    } catch (err: any) {
      console.error("[PayPal] Capture error:", err.message);
      throw err;
    }
  } catch (err: any) {
    console.error("[PayPal] Capture error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
