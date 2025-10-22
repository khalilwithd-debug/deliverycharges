import { motion } from "framer-motion";

export const InfoSection = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 bg-black text-white py-2 px-6 text-center"
    >
      <p className="text-sm font-medium">
        Use code BURN for 10% off • Limited time
      </p>
    </motion.div>
  );
};
