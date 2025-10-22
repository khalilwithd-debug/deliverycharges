import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Product } from "@shared/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ImageLightbox from "@/components/ImageLightbox";
import { formatPrice } from "@/lib/utils";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({
  product,
  isOpen,
  onClose,
}: ProductModalProps) => {
  const { addItem } = useCart();
  const [customRequest, setCustomRequest] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCustomRequest("");
    setSelectedSize("");
  }, [product, isOpen]);

  const isTShirt = product?.id.startsWith("T");

  const handleAddToCart = () => {
    if (product) {
      if (isTShirt && !selectedSize) {
        toast.error("Please select a size");
        return;
      }

      const request = isTShirt
        ? `Size: ${selectedSize}`
        : customRequest.trim()
          ? customRequest.trim()
          : undefined;

      addItem(product, request);
      toast.success("Added to cart", {
        action: {
          label: "Go to cart",
          onClick: () => navigate("/cart"),
        },
        cancel: {
          label: "Continue shopping",
          onClick: () => onClose(),
        },
      });
      onClose();
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">Product Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Images */}
                  <div className="space-y-3">
                    <div
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() =>
                        setLightbox(
                          (product.images && product.images[0]) ||
                            product.image,
                        )
                      }
                    >
                      <img
                        src={
                          (product.images && product.images[0]) || product.image
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() =>
                        setLightbox(
                          (product.images && product.images[1]) ||
                            product.image,
                        )
                      }
                    >
                      <img
                        src={
                          (product.images && product.images[1]) || product.image
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {product.isHot && (
                      <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-bold">
                        HOT
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div className="text-3xl font-bold text-black">
                      {formatPrice(product.price)}
                    </div>

                    {product.details && product.details.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Details:</h4>
                        <ul className="text-gray-600 space-y-1">
                          {product.details.map((d, i) => (
                            <li key={i}>• {d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {isTShirt && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Select Size *</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {["XS", "S", "M", "L", "XL"].map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`py-2 px-3 rounded-md font-medium transition-colors ${
                                selectedSize === size
                                  ? "bg-black text-white"
                                  : "border border-gray-300 hover:border-black"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isTShirt && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Custom design request</h4>
                        <textarea
                          value={customRequest}
                          onChange={(e) => setCustomRequest(e.target.value)}
                          placeholder="Describe your custom logo, text, colors, etc."
                          className="w-full border rounded-md p-3 min-h-24"
                        />
                      </div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-4"
                    >
                      <Button
                        onClick={handleAddToCart}
                        disabled={product.soldOut}
                        className="w-full bg-black disabled:opacity-60 hover:bg-gray-800 text-white text-lg py-6"
                      >
                        {product.soldOut
                          ? "Sold Out"
                          : `Add to Cart - ${formatPrice(product.price)}`}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />
        </>
      )}
    </AnimatePresence>
  );
};
