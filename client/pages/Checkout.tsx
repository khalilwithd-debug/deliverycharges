import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { InfoSection } from "@/components/InfoSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";
import { CheckoutData } from "@shared/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { DELIVERY_COST } from "@shared/products";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    getTotal,
    getSubtotal,
    getDiscount,
    appliedVoucher,
    clearCart,
    canCheckout,
    getCheckoutError,
  } = useCart();
  const [formData, setFormData] = useState<CheckoutData>({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutData | "shippingAddress", string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("[Checkout] Form submitted");
    e.preventDefault();

    if (!validateForm()) {
      console.log("[Checkout] Form validation failed");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Generate order number for tracking
      const orderNumber = `WWE-${Date.now().toString().slice(-6)}`;

      // Store checkout data for bill generation
      console.log("[Checkout] Items in cart:", items);
      console.log("[Checkout] Items count:", items.length);
      console.log("[Checkout] Applied voucher:", appliedVoucher);
      console.log("[Checkout] Generated order number:", orderNumber);

      const orderData = {
        ...formData,
        items,
        subtotal: getSubtotal(),
        discount: getDiscount(),
        delivery: DELIVERY_COST,
        total: getTotal(),
        appliedVoucher,
        orderDate: new Date().toISOString(),
        orderNumber,
        status: "PENDING",
      };

      console.log("[Checkout] Storing order data:", orderData);
      localStorage.setItem("wwe-order", JSON.stringify(orderData));
      console.log("[Checkout] Order data stored successfully");

      if (formData.paymentMethod === "PayPal") {
        // Create PayPal order
        const paypalItems = items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
        }));
        console.log("[Checkout] Sending PayPal items:", paypalItems);
        console.log("[Checkout] PayPal request body:", {
          items: paypalItems,
          voucherCode: appliedVoucher?.code,
          orderNumber,
          customerData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        });

        let res: Response;
        try {
          res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: paypalItems,
              voucherCode: appliedVoucher?.code,
              orderNumber,
              customerData: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
              },
            }),
          });
        } catch (fetchErr) {
          console.error("[Checkout] PayPal fetch failed:", fetchErr);
          throw new Error(
            `PayPal request failed: ${fetchErr instanceof Error ? fetchErr.message : "Network error"}`,
          );
        }

        const resStatus = res.status;
        console.log("[Checkout] PayPal response status:", resStatus);

        let data = {};
        let responseText = "";
        try {
          // Read response text immediately - do not access headers first
          responseText = await res.text();
          console.log("[Checkout] PayPal response text:", responseText);
          if (responseText) {
            try {
              data = JSON.parse(responseText);
            } catch (parseErr) {
              console.warn("[Checkout] Response is not valid JSON:", parseErr);
              data = { error: responseText || "Unknown error" };
            }
          }
        } catch (e) {
          console.error("[Checkout] Failed to read PayPal response", e);
          console.error("[Checkout] Response status:", resStatus);
          // Even if we can't read the body, report the error
          throw new Error(`PayPal request failed with status ${resStatus}`);
        }

        console.log("[Checkout] PayPal response data:", data);

        if (resStatus !== 200) {
          throw new Error(data?.error || `PayPal error: Status ${resStatus}`);
        }

        const { approveUrl, orderId } = data;
        if (!approveUrl) {
          console.error("PayPal response:", data);
          throw new Error("No payment URL received from PayPal");
        }
        console.log(
          "[Checkout] Got PayPal URL, redirecting...",
          approveUrl.substring(0, 60) + "...",
        );
        console.log("[Checkout] PayPal orderId:", orderId);

        // Store PayPal orderId in order data for later verification
        if (orderId) {
          const updatedOrder = JSON.parse(
            localStorage.getItem("wwe-order") || "{}",
          );
          updatedOrder.paypalOrderId = orderId;
          localStorage.setItem("wwe-order", JSON.stringify(updatedOrder));
          console.log("[Checkout] Stored PayPal orderId in localStorage");
        }

        setTimeout(() => {
          window.location.href = approveUrl;
        }, 100);
        return;
      }

      // Create Stripe session (for Card and Apple Pay)
      const stripeItems = items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
      }));
      console.log("[Checkout] Sending Stripe items:", stripeItems);
      console.log("[Checkout] Stripe request body:", {
        items: stripeItems,
        voucherCode: appliedVoucher?.code,
        orderNumber,
        customerData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      });

      let res: Response;
      try {
        res = await fetch("/api/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: stripeItems,
            voucherCode: appliedVoucher?.code,
            orderNumber,
            customerData: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          }),
        });
      } catch (fetchErr) {
        console.error("[Checkout] Stripe fetch failed:", fetchErr);
        throw new Error(
          `Stripe request failed: ${fetchErr instanceof Error ? fetchErr.message : "Network error"}`,
        );
      }

      const resStatus = res.status;
      console.log("[Checkout] Stripe response status:", resStatus);

      let data = {};
      let responseText = "";
      try {
        // Read response text immediately - do not access headers first
        responseText = await res.text();
        console.log("[Checkout] Stripe response text:", responseText);
        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch (parseErr) {
            console.warn("[Checkout] Response is not valid JSON:", parseErr);
            data = { error: responseText || "Unknown error" };
          }
        }
      } catch (e) {
        console.error("[Checkout] Failed to read Stripe response", e);
        console.error("[Checkout] Response status:", resStatus);
        // Even if we can't read the body, report the error
        throw new Error(`Stripe request failed with status ${resStatus}`);
      }

      console.log("[Checkout] Stripe response data:", data);

      if (resStatus !== 200) {
        throw new Error(data?.error || `Stripe error: Status ${resStatus}`);
      }

      const { url } = data;
      if (!url) {
        console.error("Stripe response:", data);
        throw new Error("No payment URL received from Stripe");
      }
      console.log(
        "[Checkout] Got Stripe URL, redirecting...",
        url.substring(0, 60) + "...",
      );
      // Use a small delay to ensure all state is saved before redirect
      setTimeout(() => {
        window.location.href = url;
      }, 100);
    } catch (error: any) {
      const errorMsg =
        error.message || "Payment processing failed. Please try again.";
      console.error("[Checkout] Payment error:", errorMsg);
      console.error("[Checkout] Error details:", error);
      setPaymentError(errorMsg);
      toast.error(errorMsg);
      setIsProcessing(false);
    }
  };

  if (items.length === 0 || !canCheckout()) {
    return (
      <div className="min-h-screen">
        <InfoSection />
        <Header />
        <div className="container mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-8">Invalid Cart</h1>
            <p className="text-gray-600 mb-8">
              {getCheckoutError() ||
                "Your cart is empty or does not meet checkout requirements."}
            </p>
            <Button
              onClick={() => navigate("/cart")}
              className="bg-black hover:bg-white hover:text-black"
            >
              Back to Cart
            </Button>
          </motion.div>
        </div>
        <Footer />
        <CartSidebar />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <InfoSection />
      <Header />
      <div className="container mx-auto px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Address Information
                </h3>
                <p className="text-blue-800">
                  Please enter your billing and shipping address on the payment
                  page (Stripe or PayPal). This ensures accurate processing and
                  secure transactions.
                </p>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {["Card", "Apple Pay", "PayPal"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: e.target.value,
                          }))
                        }
                        className="text-black focus:ring-black"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 text-sm font-medium">
                    {paymentError}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black hover:bg-white hover:text-black text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing Payment..." : "Proceed to Payment"}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6"
          >
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <hr className="mb-4" />

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedVoucher.code}):</span>
                  <span>-{formatPrice(getDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery (2 weeks):</span>
                <span>+{formatPrice(DELIVERY_COST)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-black">{formatPrice(getTotal() + DELIVERY_COST)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <CartSidebar />
    </div>
  );
}
