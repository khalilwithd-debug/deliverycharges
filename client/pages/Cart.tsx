import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { InfoSection } from "@/components/InfoSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";
import { VOUCHERS } from "@shared/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getTotal,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    canCheckout,
    getCheckoutError,
    getTShirtCount,
    getBeltCount,
  } = useCart();

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState("");

  const handleApplyVoucher = () => {
    const voucher = VOUCHERS.find(
      (v) => v.code.toLowerCase() === voucherCode.toLowerCase(),
    );
    if (voucher) {
      applyVoucher(voucher);
      setVoucherCode("");
      setVoucherError("");
    } else {
      setVoucherError("Invalid voucher code");
    }
  };

  if (items.length === 0) {
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
            <h1 className="text-3xl font-bold mb-8">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Add some WWE championship belts to get started!
            </p>
            <Link to="/">
              <Button className="bg-black hover:bg-white hover:text-black">
                Continue Shopping
              </Button>
            </Link>
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
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    {item.customRequest && (
                      <p className="text-sm text-gray-600 mb-1">
                        Custom: {item.customRequest}
                      </p>
                    )}
                    <p className="text-black font-bold text-xl">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-6"
            >
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Voucher Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Voucher Code
                </label>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                    <span className="text-green-700 font-medium">
                      {appliedVoucher.code} applied!
                    </span>
                    <button
                      onClick={removeVoucher}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleApplyVoucher();
                          }
                        }}
                        placeholder="Enter voucher code"
                        className="flex-1"
                      />
                      <Button onClick={handleApplyVoucher} variant="outline">
                        Apply
                      </Button>
                    </div>
                    {voucherError && (
                      <p className="text-red-500 text-sm">{voucherError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
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
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-black">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>

              {getCheckoutError() && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 text-sm font-medium">
                    {getCheckoutError()}
                  </p>
                </div>
              )}

              {getTShirtCount() > 0 && getBeltCount() === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-700 text-sm">
                    T-shirts only: Minimum 4 required, or add a belt to purchase any quantity.
                  </p>
                </div>
              )}

              <Link to="/checkout" className={!canCheckout() ? "pointer-events-none opacity-50" : ""}>
                <Button
                  disabled={!canCheckout()}
                  className="w-full bg-black hover:bg-white hover:text-black text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <CartSidebar />
    </div>
  );
}
