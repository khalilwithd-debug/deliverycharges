import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InfoSection } from "@/components/InfoSection";
import { CartSidebar } from "@/components/CartSidebar";
import {
  ShieldCheck,
  Award,
  Package,
  CheckCircle,
  Quote,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";

const LOGO =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F82c0af6178024f2eaa8410500e19f4e2?format=webp&width=800";
const BANNER =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fbd1552e34f2d44928b14ba09af97aa72?format=webp&width=1600";
const DESIGN1 =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fce264f89985544f7b62040385ee3ed62?format=webp&width=800";
const DESIGN2 =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8f79e477e182446481c7b40d41f5cce7?format=webp&width=800";
const DESIGN3 =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F577e8a5898114753aa5613bbdf84727f?format=webp&width=800";
const WHY1 =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0d7bfc25e959456d88af4b3c50b22949?format=webp&width=800";
const WHY2 =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F025634f30d884a2bb84a271393075b3b?format=webp&width=800";
const MATERIALS_MAIN =
  "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa5f35d800c474d02a133ceddf95710b9?format=webp&width=800";

export default function Info() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const open = (src: string) => setLightbox(src);

  return (
    <div className="min-h-screen">
      <InfoSection />
      <Header />
      <div className="h-24 md:h-[108px]"></div>

      {/* Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <img
          src={BANNER}
          alt="Belts hero"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="container mx-auto px-6 py-24 relative z-10 text-center font-space">
          <motion.img
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            src={LOGO}
            alt="Logo"
            className="mx-auto w-24 h-24 object-contain mb-6 cursor-pointer"
            onClick={() => open(LOGO)}
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold"
          >
            Custom Championship Belts – Crafted for Champions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-white/90 max-w-3xl mx-auto"
          >
            Premium custom championship belts for all leagues and events
            worldwide.
          </motion.p>
        </div>
      </section>

      {/* Materials & Craft */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-4 font-space">
              Materials & Craft
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <Award className="w-5 h-5 text-black mt-1" /> HD 24k gold plates
                with genuine gemstones
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-black mt-1" /> Pure cowhide
                leather straps for durability and comfort
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="w-5 h-5 text-black mt-1" /> Built for
                functionality and a luxurious finish
              </li>
            </ul>
            <div
              className="mt-6 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => open(MATERIALS_MAIN)}
            >
              <img
                src={MATERIALS_MAIN}
                alt="Detail"
                loading="lazy"
                className="w-full h-48 object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-4 font-space">
              Design Process
            </h2>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>
                2D Design Approval – a detailed 2D design begins your journey.
              </li>
              <li>
                Precision Crafting – CNC‑machined main and side plates for exact
                patterns.
              </li>
              <li>
                Premium Finishing – genuine materials, polished detailing, and
                custom options.
              </li>
            </ol>
            <p className="mt-4 font-semibold">
              Investment range: $1,000 – $4,000 (depends on complexity).
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[DESIGN1, DESIGN2, DESIGN3].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Process ${i + 1}`}
                  loading="lazy"
                  onClick={() => open(src)}
                  className="h-28 w-full object-cover rounded cursor-pointer"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Explore belts */}
      <section className="py-16 px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-4 font-space">
            Explore Our Championship Belts
          </h2>
          <p className="text-white/80 mb-6">
            Unbeaten craftsmanship, refined artwork, and world‑class designs:
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              "WWE Championship Belts",
              "WCW Championship Belts",
              "WWF Championship Belts",
              "ECW Championship Belts",
              "TNA Championship Belts",
              "UFC Championship Belts",
              "Custom CNC Championship Belts",
            ].map((t) => (
              <div key={t} className="bg-white/5 rounded px-3 py-2">
                • {t}
              </div>
            ))}
          </div>
          <p className="mt-6 text-white/90">
            Every strap is pure cowhide leather with extensive customization
            options: colors, textures, logos, titles, gemstones, engravings, and
            unique finishes.
          </p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-4 font-space">
              Why Choose Us
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <Award className="w-5 h-5 text-black mt-1" /> Authentic HD belts
                with 24k gold plates and genuine gemstones
              </li>
              <li className="flex gap-2">
                <Package className="w-5 h-5 text-black mt-1" /> Premium quality
                cowhide leather straps
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="w-5 h-5 text-black mt-1" /> ISO
                certified – international quality standards
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-black mt-1" /> Complete
                customization from logos to side plates
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-black mt-1" /> Fast
                worldwide delivery in 2–3 weeks
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-black mt-1" /> 24/7
                customer support via WhatsApp and email
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl p-6 bg-black text-white"
          >
            <h3 className="text-xl font-bold mb-3 font-space">
              How to Get Started
            </h3>
            <p className="text-white/90">
              Share your concept and requirements. We’ll prepare a precise 2D
              layout, finalize specs, then move to machining and finishing. Your
              championship ships ready to display, wear and celebrate.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[WHY1, WHY2].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  loading="lazy"
                  onClick={() => open(src)}
                  className="h-28 w-full object-cover rounded cursor-pointer"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center font-space">
            What Buyers Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {[
              {
                name: "Mohammad – Dubai",
                text: "I ordered the limited edition WWE Undisputed Championship with the John Cena side plates. The delivery was quick and it came packed properly in the belt bag. Honestly, it looks and feels just like the real thing you see on TV.",
              },
              {
                name: "Chris Taylor – Manchester, England",
                text: "I bought the WWE Spinner Belt and the Big Gold together in a bundle. Both belts are solid, heavy, and the details are better than I expected. Definitely worth it if you’re a collector.",
              },
              {
                name: "Raylene Johnson – Chicago",
                text: "I’ve been wanting the Attitude Era Women’s Championship for years. The delivery took about a week longer than expected, but once it arrived, I was really happy with it. The leather strap feels so much better than the usual replicas.",
              },
              {
                name: "Emin Mehrabi – UAE",
                text: "I asked for a custom belt to use for my company events, and they delivered exactly what I had in mind. The design was spot on and it was finished in about 3 weeks, which was faster than I thought.",
              },
              {
                name: "Christon Andrew – Houston, Texas",
                text: "I went for the 2013 WWE Championship with three different Shield side plates. The belts are heavy, the leather feels real, and the plates look sharp. Honestly, it’s a great addition to my collection.",
              },
              {
                name: "Madi Wilson – Australia",
                text: "I ordered the WWF Attitude Heavyweight Championship and it showed up in perfect condition. It even came in a proper belt bag. The weight and shine are just right.",
              },
            ].map((t, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow h-full flex flex-col"
              >
                <div className="flex items-center gap-2 text-black mb-3">
                  <Quote className="w-4 h-4" />
                  <span className="font-semibold">{t.name}</span>
                  <span className="ml-auto flex items-center gap-1 text-green-600 text-sm whitespace-nowrap">
                    <BadgeCheck className="w-4 h-4" /> Verified Buyer
                  </span>
                </div>
                <p className="text-gray-700">{t.text}</p>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar />
      <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
