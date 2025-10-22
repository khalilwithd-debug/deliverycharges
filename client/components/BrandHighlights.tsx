import { motion } from "framer-motion";

export const BrandHighlights = () => {
  const brands = [
    {
      name: "WWE 2K",
      img: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F3101a3f5d7bd4e10bedd39196a5d9890?format=webp&width=800",
      href: "https://www.facebook.com/share/g/1FNLn37Fvm/?mibextid=wwXIfr",
    },
    {
      name: "YouTube",
      img: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Faf0673acfb604e8889a2ddffe176ca96?format=webp&width=800",
      href: "https://youtube.com/@burnitdownyt?si=M1570QuonyesV4R-",
    },
    {
      name: "Instagram Store",
      img: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F31dc816c340147fc8fd8f25ce3164b15?format=webp&width=800",
      href: "https://www.instagram.com/burnitdown.store?igsh=MWc0aDhpZTd0b3dudA%3D%3D&utm_source=qr",
    },
    {
      name: "Instagram",
      img: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc827988ce75f45f29224bc0cfcf9cb4c?format=webp&width=800",
      href: "https://www.instagram.com/burnitdownyt",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Brand Highlights</h2>
          <p className="text-gray-600">
            Join our WWE 2K community group and explore some of our top brand
            highlights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {brands.map((brand, index) => (
            <a
              key={brand.name}
              href={brand.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-lg bg-white flex items-center justify-center overflow-hidden cursor-pointer shadow"
              >
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="object-contain w-full h-full p-4"
                />
              </motion.div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
