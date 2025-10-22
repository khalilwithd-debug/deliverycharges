import { motion } from "framer-motion";
import { MERCH_PRODUCTS, Product } from "@shared/products";
import { Button } from "@/components/ui/button";
import { ProductModal } from "@/components/ProductModal";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";

export const MerchSection = () => {
  const [selected, setSelected] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(MERCH_PRODUCTS.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const currentItems = MERCH_PRODUCTS.slice(startIdx, startIdx + itemsPerPage);

  const openModal = (item: Product) => {
    setSelected(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  return (
    <section id="merch" className="py-16 px-2 md:px-6 bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Pro Wrestling Merch</h2>

          {/* Circular Navigation Dots - Centered on Top */}
          <div className="flex justify-center space-x-3 mb-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  index === currentPage
                    ? "bg-black border-black scale-110"
                    : "bg-transparent border-black"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <p className="text-gray-600">
            Step into the spotlight with custom WWE merch!
          </p>
        </motion.div>

        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-lg p-6 text-center overflow-hidden relative"
            >
              {item.soldOut && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                  SOLD OUT
                </div>
              )}
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-sm mb-2">{item.name}</h3>
              <div className="text-lg font-bold mb-3">
                {formatPrice(item.price)}
              </div>
              <Button
                onClick={() => openModal(item)}
                className="w-full bg-black hover:bg-white hover:text-black"
              >
                View Details
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom pagination dots for mobile */}
        <div className="flex justify-center space-x-3 mt-8 md:hidden">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={`bottom-${index}`}
              onClick={() => setCurrentPage(index)}
              className={`w-4 h-4 rounded-full border-2 ${
                index === currentPage
                  ? "bg-black border-black"
                  : "bg-transparent border-black"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <ProductModal product={selected} isOpen={isOpen} onClose={closeModal} />
    </section>
  );
};
