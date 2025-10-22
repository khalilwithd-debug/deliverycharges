import { motion } from "framer-motion";
import { Product } from "@shared/products";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({
  product,
  index,
  onViewDetails,
}: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden relative group"
    >
      {product.isHot && (
        <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-bold z-10">
          HOT
        </div>
      )}

      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="text-base md:text-lg font-bold text-black mb-2 md:mb-3">
          {formatPrice(product.price)}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => onViewDetails(product)}
            className="w-full bg-black hover:bg-white hover:text-black transition-all duration-300"
          >
            View Details
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
