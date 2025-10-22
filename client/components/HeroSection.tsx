import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroSection = () => {
  const isMobile = useIsMobile();
  const desktopBg =
    "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fbb05f806738f41afb6c3a0b51a1ffac0?format=webp&width=1200";
  const mobileBg =
    "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F66c1babcce114eb896b5f4a03e74236e?format=webp&width=800";
  return (
    <section
      className={`bg-black text-white px-6 relative overflow-hidden ${isMobile ? "h-[65vh]" : "h-[80vh]"}`}
      style={{
        backgroundImage: `url('${isMobile ? mobileBg : desktopBg}')`,
        backgroundSize: isMobile ? "125% 90%" : "cover",
        backgroundPosition: isMobile ? "center 45%" : "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="container mx-auto relative z-10 h-full flex items-end justify-center pb-10 md:items-center md:justify-end md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mr-0 md:mr-6"
        >
          <a
            href="https://www.wwe.com/wrestlemania42-pre-registration"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 transition-all duration-300 px-8 py-6 text-lg"
            >
              Tickets
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
