import { InfoSection } from "@/components/InfoSection";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ShopSection } from "@/components/ShopSection";
import { MerchSection } from "@/components/MerchSection";
import { BrandHighlights } from "@/components/BrandHighlights";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";

export default function Index() {
  return (
    <div className="min-h-screen">
      <InfoSection />
      <Header />
      <div className="h-24 md:h-[108px]"></div>
      <HeroSection />
      <ShopSection />
      <MerchSection />
      <BrandHighlights />
      <Footer />
      <CartSidebar />
    </div>
  );
}
