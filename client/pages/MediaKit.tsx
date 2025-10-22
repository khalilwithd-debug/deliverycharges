import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InfoSection } from '@/components/InfoSection';
import { CartSidebar } from '@/components/CartSidebar';

export default function MediaKit() {
  return (
    <div className="min-h-screen">
      <InfoSection />
      <Header />
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Media Kit</h1>
        <p className="text-gray-600 mb-6">Logos, brand colors, and usage guidelines.</p>
        <div className="bg-white rounded-lg shadow p-6">
          <img src="https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F82c0af6178024f2eaa8410500e19f4e2?format=webp&width=800" alt="Logo" className="w-40 h-40 object-contain" />
        </div>
      </section>
      <Footer />
      <CartSidebar />
    </div>
  );
}
