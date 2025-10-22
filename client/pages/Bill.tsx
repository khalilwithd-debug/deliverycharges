import { useEffect, useState } from "react";
import { CheckoutData, CartItem, Voucher, DELIVERY_COST } from "@shared/products";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/utils";

interface OrderData extends CheckoutData {
  items: CartItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  appliedVoucher: Voucher | null;
  orderDate: string;
  orderNumber?: string;
  paypalOrderId?: string;
  status?: "PENDING" | "PAID" | "FAILED";
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function Bill() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = localStorage.getItem("wwe-order");
    if (storedOrder) {
      try {
        const order = JSON.parse(storedOrder);
        setOrderData(order);
        console.log("[Bill] Order loaded from storage:", order);

        // Check payment status from URL parameters
        const params = new URLSearchParams(window.location.search);
        const provider = params.get("provider");
        console.log("[Bill] Provider from URL:", provider);

        if (provider === "stripe") {
          const session_id = params.get("session_id");
          console.log("[Bill] Stripe session_id:", session_id);
          if (session_id) {
            console.log("[Bill] Verifying Stripe session...");
            fetch(`/api/stripe/verify-session?session_id=${session_id}`)
              .then((r) => {
                const status = r.status;
                console.log("[Bill] Stripe verify response status:", status);
                return r.text().then((text) => {
                  console.log("[Bill] Stripe verify response text:", text);
                  const data = text ? JSON.parse(text) : {};
                  return { data, status };
                });
              })
              .then(({ data, status }) => {
                console.log("[Bill] Stripe verify data:", data);
                if (status === 200 && data.paid) {
                  console.log("[Bill] Payment confirmed as PAID");
                  setOrderData((prev) =>
                    prev ? { ...prev, status: "PAID" } : null,
                  );
                } else {
                  console.warn("[Bill] Payment status is not paid:", data);
                }
              })
              .catch((err) => {
                console.error("[Bill] Stripe verification error:", err);
              });
          } else {
            console.warn(
              "[Bill] Stripe provider selected but no session_id in URL",
            );
          }
        } else if (provider === "paypal") {
          // Get PayPal orderId from localStorage (stored during checkout)
          const orderId = order?.paypalOrderId;
          console.log("[Bill] PayPal orderId from localStorage:", orderId);
          if (orderId) {
            console.log("[Bill] Capturing PayPal order...");
            fetch(`/api/paypal/capture?orderId=${orderId}`)
              .then((r) => {
                console.log("[Bill] PayPal capture response status:", r.status);
                return r
                  .clone()
                  .text()
                  .then((text) => {
                    console.log("[Bill] PayPal capture response text:", text);
                    return text ? JSON.parse(text) : {};
                  });
              })
              .then((data) => {
                console.log("[Bill] PayPal capture data:", data);
                if (data.paid) {
                  console.log("[Bill] Payment confirmed as PAID");
                  setOrderData((prev) =>
                    prev ? { ...prev, status: "PAID" } : null,
                  );
                } else {
                  console.warn("[Bill] Payment status is not paid:", data);
                }
              })
              .catch((err) => {
                console.error("[Bill] PayPal capture error:", err);
              });
          } else {
            console.warn(
              "[Bill] PayPal provider selected but no orderId found in order data",
            );
          }
        } else if (provider) {
          console.warn("[Bill] Unknown provider:", provider);
        } else {
          console.log(
            "[Bill] No payment provider in URL - showing pending status",
          );
        }
      } catch (err) {
        console.error("[Bill] Error parsing stored order:", err);
      }
    } else {
      console.log("[Bill] No stored order found");
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
          <p>Please complete an order first.</p>
          <p className="text-sm text-gray-500 mt-4">
            If you just completed payment, the page will refresh automatically.
          </p>
        </div>
      </div>
    );
  }

  // Use the stored order number or generate one if not available
  const orderNumber =
    orderData.orderNumber || `WWE-${Date.now().toString().slice(-6)}`;

  return (
    <div
      className="min-h-screen bg-white p-8"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 right-4 z-50 bg-white text-black border border-black rounded-full w-9 h-9 flex items-center justify-center shadow hover:bg-gray-50"
        aria-label="Close bill"
      >
        ×
      </button>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "black" }}>
            BURNITDOWNYT
          </h1>
          <h2 className="text-2xl font-bold">WWE CHAMPIONSHIP BELTS</h2>
        </div>

        {/* Bill Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#28a745" }}>
              BILL TO:
            </h3>
            <div className="space-y-1">
              <p className="font-semibold">{orderData.name}</p>
              <p>{orderData.email}</p>
              <p>{orderData.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#28a745" }}>
              ORDER DETAILS:
            </h3>
            <div className="space-y-1">
              <p>
                <strong>Order Number:</strong> {orderNumber}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(orderData.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Payment Method:</strong> {orderData.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: orderData.status === "PAID" ? "#28a745" : "#dc2626",
                  }}
                >
                  {orderData.status === "PAID" ? "Paid" : "Pending Payment"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4" style={{ color: "#28a745" }}>
            ITEMS ORDERED:
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th className="border border-gray-300 p-3 text-left">Item</th>
                <th className="border border-gray-300 p-3 text-center">
                  Quantity
                </th>
                <th className="border border-gray-300 p-3 text-right">
                  Unit Price
                </th>
                <th className="border border-gray-300 p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="border border-gray-300 p-3">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.description}
                    </div>
                    {item.customRequest && (
                      <div className="text-sm text-gray-700">
                        <strong>Custom:</strong> {item.customRequest}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-3 text-right">
                    {formatPrice(item.price)}
                  </td>
                  <td className="border border-gray-300 p-3 text-right font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal:</span>
                <span>{formatPrice(orderData.subtotal)}</span>
              </div>
              {orderData.appliedVoucher && (
                <div
                  className="flex justify-between py-2 border-b"
                  style={{ color: "#28a745" }}
                >
                  <span>Discount ({orderData.appliedVoucher.code}):</span>
                  <span>-{formatPrice(orderData.discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b text-sm text-gray-600">
                <span>Delivery (2 weeks):</span>
                <span>+{formatPrice(orderData.delivery || DELIVERY_COST)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-black text-xl font-bold">
                <span>TOTAL:</span>
                <span style={{ color: "black" }}>
                  {formatPrice(orderData.total + (orderData.delivery || DELIVERY_COST))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t-2 border-black pt-6">
          <p className="font-bold text-lg mb-2">Thank you for your order!</p>
          <p className="text-gray-600">
            For questions about your order, please contact us with your order
            number.
          </p>
          <div className="mt-4 space-y-1">
            <p>
              <strong>Phone:</strong> +1 929 6129 615
            </p>
            <p>
              <strong>Address:</strong> 719 2nd Ave, New York NY 10016
            </p>
            <p>
              <strong>Email:</strong> burnitdownyt@gmail.com
            </p>
          </div>
        </div>

        {/* Print Instructions */}
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded shadow-lg max-w-sm">
          <p className="font-semibold mb-2">💡 Pro Tip:</p>
          <p className="text-sm">
            Press <kbd className="bg-gray-200 px-1 rounded">Ctrl+P</kbd>{" "}
            (Windows) or <kbd className="bg-gray-200 px-1 rounded">Cmd+P</kbd>{" "}
            (Mac) to print or save as PDF.
          </p>
        </div>
      </div>
    </div>
  );
}
