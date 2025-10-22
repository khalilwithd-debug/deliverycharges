import path from "path";
import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const VOUCHERS = [
  { code: "BURN", discount: 10, type: "percentage" },
  { code: "MOHAMMED", discount: 15, type: "percentage" },
  { code: "OMAR", discount: 15, type: "percentage" },
  { code: "SULTAN", discount: 15, type: "percentage" },
  { code: "RESTINPEACE21", discount: 21, type: "percentage" },
  { code: "MITBCASHIN", discount: 30, type: "percentage" },
  { code: "F5BEAST", discount: 25, type: "percentage" },
  { code: "TRIBALCHIEF1316", discount: 40, type: "percentage" },
  { code: "christonsecret", discount: 95, type: "percentage" }
];
const DELIVERY_COST = 25;
const PRODUCTS = [
  {
    id: "1",
    name: "WWE Championship",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F806f9c142c6c44ca95e2b7adacdb1de0?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F806f9c142c6c44ca95e2b7adacdb1de0?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff37dcc4d0c8448e08e777e0a52ed8273?format=webp&width=800"
    ],
    description: "24k gold plated plates, real gemstones, and genuine leather strap. HD CNC‑machined 12mm plates for authentic TV feel.",
    details: [
      "12mm plates for authentic TV feel",
      "Includes Limited Edition John Cena side plates",
      "Worldwide shipping within 2 weeks"
    ]
  },
  {
    id: "2",
    name: "WWE Spinner Championship",
    price: 1099,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F7c9dea0bc8be4bd0a7a966960a3b6f9c?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F7c9dea0bc8be4bd0a7a966960a3b6f9c?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa2c9143d51804c038b6b9744a00dc939?format=webp&width=800"
    ],
    description: "24k gold‑plated plates, real gemstones, genuine leather. HD CNC‑machined with iconic spinning centerpiece and custom name plate option.",
    details: [
      "8mm plates for authentic TV feel",
      "Fully functional spinning centerpiece",
      "Includes custom engraved name plate",
      "Worldwide shipping within 2 weeks"
    ]
  },
  {
    id: "3",
    name: "WWE Winged Eagle Championship",
    price: 1099,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F3f62b0f5b102478c84cdc778bb651439?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F3f62b0f5b102478c84cdc778bb651439?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fbcdeb78f15e9448f8294471abea8054e?format=webp&width=800"
    ],
    description: "24k gold‑plated plates, real gemstones, genuine leather. Faithful recreation of the legendary Winged Eagle design.",
    details: [
      "8mm plates for TV‑quality feel",
      "Classic Winged Eagle with globe and eagle engravings",
      "Worldwide shipping within 2 weeks"
    ]
  },
  {
    id: "4",
    name: "WWE World Heavyweight Championship – Big Gold",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb4da063f981b41b48d29d6325d50cdef?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb4da063f981b41b48d29d6325d50cdef?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd7909aa45bf140c9811134414e83d094?format=webp&width=800"
    ],
    description: "24k gold‑plated plates, real gemstones, genuine leather. The legendary Big Gold with intricate engravings.",
    details: [
      "6mm plates for classic lightweight feel",
      "Intricate lion and crown engravings",
      "Includes engraved name plates of legendary champions",
      "Worldwide shipping within 2 weeks"
    ]
  },
  {
    id: "5",
    name: "WWE Undisputed Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9572095db48047ba885fa0427d420149?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9572095db48047ba885fa0427d420149?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8588a7acd35f43489481692fb757bfc0?format=webp&width=800"
    ],
    description: "24k gold‑plated plates, real gemstones, genuine leather. Iconic Undisputed design with optional custom name plate.",
    details: [
      "6mm plates for authentic TV feel",
      "Custom engraved name plate available",
      "Detailed dual‑eagle design with classic WWE logo",
      "Worldwide shipping within 2 weeks"
    ]
  },
  {
    id: "6",
    name: "WWE World Heavyweight Championship (Modern)",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F221850ecef6843b88b54c432abb1efa1?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F221850ecef6843b88b54c432abb1efa1?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F49c436befc5741d59f183d280bfa92c7?format=webp&width=800"
    ],
    description: "Modern redesign of Big Gold with prominent WWE logo. 24k plates, gemstones, genuine leather.",
    details: [
      "6mm plates for authentic TV feel",
      "Modernized Big Gold with detailed gold etching",
      "Prominent WWE logo centerpiece and side plates",
      "Worldwide shipping within 2 weeks"
    ]
  },
  {
    id: "7",
    name: "Custom WWE Side Plates (Any Superstar / Custom Design)",
    price: 299,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0fdf9e950f1247718be4a4b2dce9e9b1?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0fdf9e950f1247718be4a4b2dce9e9b1?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F56e44e68778c4d519b9fc6e169324c6d?format=webp&width=800"
    ],
    description: "24k gold‑plated finish with real gemstones. Precision CNC‑machined side plates compatible with removable‑plate titles.",
    details: [
      "Compatible with official and TV‑style belts",
      "Any Superstar logo or fully custom design",
      "Personal logos and brand marks supported"
    ]
  },
  {
    id: "8",
    name: "WWE NXT Championship (Gold / Grey)",
    price: 850,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F50f25f48bd0c4a449bd8599f86cdf0a2?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F50f25f48bd0c4a449bd8599f86cdf0a2?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F39dd246d89a74870b122bd4e465f1ebf?format=webp&width=800"
    ],
    description: "Bold “X” centerpiece in gold or grey finish. HD CNC‑machined plates on genuine leather.",
    details: [
      "6mm plates for authentic TV feel",
      "Choice of Gold or Grey finish",
      "Detailed NXT engravings with premium side plates"
    ]
  },
  {
    id: "9",
    name: "WWF Smoking Skull Championship",
    price: 1049,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F25a6cd061ae642febb72a88305bc4131?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F25a6cd061ae642febb72a88305bc4131?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F4dc3b0b61eee43b8ba596e3fb76836fd?format=webp&width=800"
    ],
    description: "Iconic skull‑and‑snake custom belt made for “Stone Cold” Steve Austin. 24k plates, gemstones, genuine leather.",
    details: [
      "8mm plates for TV‑quality feel",
      "Signature skull with red WWF logo",
      "Intricate snakes and flame engravings"
    ]
  },
  {
    id: "10",
    name: "WWF Heavyweight Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8347b571bbb947bf913dac08fd59dd3d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8347b571bbb947bf913dac08fd59dd3d?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc8cec5e1503b4321bb523e00e47fa585?format=webp&width=800"
    ],
    description: "Classic eagle and globe centerpiece from the golden era. 24k plates, gemstones, genuine leather.",
    details: [
      "8mm plates for authentic TV feel",
      "Classic WWF logo with eagle and globe",
      "Highly detailed side plates with gold etching"
    ]
  },
  {
    id: "11",
    name: "WWE John Cena Edition US Spinner Championship",
    price: 1099,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F90e89752db2b4687a7130b0e4a4bd6a4?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F90e89752db2b4687a7130b0e4a4bd6a4?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0479cf317fd94e5aa7d1d9c28c40c78e?format=webp&width=800"
    ],
    description: "Patriotic red, white and blue design with functional spinning “US” centerpiece.",
    details: [
      "8mm plates for authentic TV feel",
      "Functional spinning centerpiece",
      "American flag side plates and Cena signature elements"
    ]
  },
  {
    id: "12",
    name: "WWE Intercontinental Championship (White Strap)",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F336b0fdfd929422f8070df55f75422b9?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F336b0fdfd929422f8070df55f75422b9?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9f608885d78d4571a978a4f97974914b?format=webp&width=800"
    ],
    description: "Classic white strap IC title with globe centerpiece and black/gold lettering.",
    details: [
      "8mm plates for TV‑quality feel",
      "Iconic globe centerpiece with detailed etching",
      "Classic WWE styling on side plates"
    ]
  },
  {
    id: "13",
    name: "WWE Hardcore Championship – Travis Scott Edition",
    price: 1499,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd132c05a542141478452cc05cf058662?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd132c05a542141478452cc05cf058662?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F4f0eb17e51484d4ab29c369072a04509?format=webp&width=800"
    ],
    description: "Modern twist on the Hardcore Title with custom overlays and graffiti‑style detailing inspired by Travis Scott.",
    details: [
      "12mm plates for authentic TV feel",
      "Custom distressed overlay and graffiti text",
      "Genuine leather with premium hardware"
    ]
  },
  {
    id: "14",
    name: "WWE Championship – 2016 Edition",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fed8a644539e442b18f3de771f639eef1?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fed8a644539e442b18f3de771f639eef1?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc4bac9de7d4b4bd1990ff432279ce29c?format=webp&width=800"
    ],
    description: "Bold modern WWE logo centerpiece with crystal detailing and red triangle panels.",
    details: [
      "12mm plates for authentic TV feel",
      "Large WWE logo centerpiece with crystals",
      "Customizable side plates"
    ]
  },
  {
    id: "15",
    name: "WWE Tribal Chief Championship",
    price: 1049,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2f82e566689b412889fda9a9c54b5d72?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2f82e566689b412889fda9a9c54b5d72?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fae4d0edadaa34030afa1af7988f7fbf4?format=webp&width=800"
    ],
    description: "Special edition honoring Roman Reigns’ reign with black and red tribal‑inspired detailing.",
    details: [
      "8mm plates for authentic TV feel",
      "Exclusive “Tribal Chief” design elements",
      "Customizable side plates"
    ]
  },
  {
    id: "16",
    name: "WWE Intercontinental Championship (Modern)",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd8911714f8754881b0e84ccc1ae19a51?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd8911714f8754881b0e84ccc1ae19a51?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc244865605a34cfeb7a5bd9554e15e74?format=webp&width=800"
    ],
    description: "Modern reimagining of the IC Title with globe‑centered plate and laurel accents.",
    details: [
      "8mm plates for TV‑quality feel",
      "Globe centerpiece with laurel wreath detail",
      "Customizable Superstar side plates"
    ]
  },
  {
    id: "17",
    name: "WWE Universal Championship (Red Edition)",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F5aaca6afaabe47fa9a020a7792aee4cf?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F5aaca6afaabe47fa9a020a7792aee4cf?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1b2a75d7704349a89e34887340de5e7b?format=webp&width=800"
    ],
    description: "First Universal Title introduced in 2016 with red strap and large WWE logo.",
    details: [
      "12mm plates for authentic TV feel",
      "Red leather strap with gemstone detailing",
      "Customizable side plates"
    ]
  },
  {
    id: "18",
    name: "TNA World Heavyweight Championship",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F21bc1adf74114454b3b1f89e0bdfe1b3?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F21bc1adf74114454b3b1f89e0bdfe1b3?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F5f102c6c109c4806a1c067d9eabcf61f?format=webp&width=800"
    ],
    description: "Historic TNA design with bold logo and globe engravings on genuine leather.",
    details: [
      "8mm plates for authentic TV feel",
      "Classic TNA logo centerpiece",
      "Globe���etched side plates with gold detailing"
    ]
  },
  {
    id: "19",
    name: "WWE United States Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1d8d1b1b3fcf4ef6a479988b5a7cbff6?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1d8d1b1b3fcf4ef6a479988b5a7cbff6?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe803152ce0024644b0785c13a42581ff?format=webp&width=800"
    ],
    description: "Modern American‑inspired design with stars, stripes and golden eagle centerpiece.",
    details: [
      "8mm plates for TV‑quality feel",
      "American flag motif with gold eagle",
      "Customizable WWE logo side plates"
    ]
  },
  {
    id: "20",
    name: "Money in the Bank Briefcase",
    price: 199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F6c6e39b3e60f4dac9f044687d7ee4ff5?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F6c6e39b3e60f4dac9f044687d7ee4ff5?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F7dee7378c80d40d19f932f1cd749b2ea?format=webp&width=800"
    ],
    description: "Iconic green briefcase with gold lettering from the legendary ladder match.",
    details: [
      "Full‑size replica with glossy green finish",
      "Functional handle and secure latch",
      "Lightweight yet durable construction"
    ],
    soldOut: true
  },
  {
    id: "21",
    name: "WWE Championship – 2013 Edition (The Rock)",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F184c163fe1d74b909a669a5c795d5a5d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F184c163fe1d74b909a669a5c795d5a5d?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F4fb3d115f6e5421abd565b4a4254093e?format=webp&width=800"
    ],
    description: "Large logo title introduced by The Rock with custom Brahma Bull side plates.",
    details: [
      "12mm plates for authentic TV feel",
      "Crystal‑detailed WWE logo centerpiece",
      "Includes Brahma Bull side plates"
    ]
  },
  {
    id: "22",
    name: "Custom Championship (Design Your Own)",
    price: 1100,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F462f6df9ca644a97bc0990f98ae73d32?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F462f6df9ca644a97bc0990f98ae73d32?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0dec2ce2784f453dae618f0d93cdb9fb?format=webp&width=800"
    ],
    description: "Fully personalized title: plates, logos, text, colors and strap styles made to your spec.",
    details: [
      "Design a brand‑new belt or modify an existing title",
      "Full control over plates, finish, engravings and stones",
      "Genuine leather straps with gold‑plated hardware"
    ]
  },
  {
    id: "23",
    name: "UFC World Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1b8fa823e6194e13bc6e22fe1a53289d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1b8fa823e6194e13bc6e22fe1a53289d?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Feb6465955d3e410a99895c79b2e032a8?format=webp&width=800"
    ],
    description: "Octagonal UFC design with national flag accents and premium engraving.",
    details: [
      "8mm plates for authentic fight‑night feel",
      "Octagonal gold centerpiece with UFC logo",
      "National flag accents and gemstone inlays"
    ]
  },
  {
    id: "24",
    name: "WWE Undisputed Championship – Roman Reigns 1316 Tribal Chief Edition",
    price: 1299,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1e1dc657237447f48c4dba7c64fd8fae?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1e1dc657237447f48c4dba7c64fd8fae?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc3f720f608a5460e9c0ce10673ae147c?format=webp&width=800"
    ],
    description: "Special edition with WWE logo centerpiece, red gemstone accents and Tribal Chief side plates.",
    details: [
      "12mm plates for authentic TV feel",
      "Roman Reigns “Tribal Chief” side plates",
      "Red and black tribal‑inspired detailing"
    ]
  },
  {
    id: "25",
    name: "WWE Brahma Bull Championship – The Rock Exclusive Edition",
    price: 1099,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8458562dab804f4dbf8ba71a9e833c77?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8458562dab804f4dbf8ba71a9e833c77?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd5ae1b3c707243e39826fcfe01cd4058?format=webp&width=800"
    ],
    description: "Iconic Brahma Bull centerpiece with red gemstone eyes and custom side plates.",
    details: [
      "8mm HD CNC‑machined plates",
      "Custom Rock side plates with lightning accents",
      "Black leather strap with detailed tooling"
    ]
  },
  {
    id: "26",
    name: "WWE Women's World Championship (White Strap Special Edition)",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa77631d3585b43fab3c4ba892a29382f?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa77631d3585b43fab3c4ba892a29382f?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2feba3f25c294823bd1b619bce779d35?format=webp&width=800"
    ],
    description: "White strap special with bold WWE logo over globe pattern and crystal‑studded border.",
    details: [
      "8mm HD CNC‑machined plates",
      "Polished logo over globe pattern with floral etching",
      "Crystal‑studded border for TV presence"
    ]
  },
  {
    id: "27",
    name: "WWE Women's Undisputed Championship (White Strap Edition)",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F57047ee7d56f4a73a297ad69ec595e2b?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F57047ee7d56f4a73a297ad69ec595e2b?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8b74cfb3c9154db6856158f0cae5507c?format=webp&width=800"
    ],
    description: "24k plates with textured detailing, black and silver logo centerpiece with red gemstones.",
    details: [
      "12mm HD CNC‑machined plates",
      "Interchangeable Superstar side plates",
      "White leather strap with reinforced stitching"
    ]
  },
  {
    id: "28",
    name: "WWE Intercontinental Championship – Classic Globe Edition",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F7b987ee317aa44d99bc63cd0ea09c4ec?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F7b987ee317aa44d99bc63cd0ea09c4ec?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F577a0fee40ba4afd944712d06e8e6601?format=webp&width=800"
    ],
    description: "Classic IC with iconic blue globe centerpiece and textured gold etching on black strap.",
    details: [
      "8mm gold��plated plates",
      "Blue globe centerpiece",
      "Detailed tooling on leather strap"
    ]
  },
  {
    id: "29",
    name: "TNA World Championship – Golden Legacy Edition",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fdc90b57e19734ed0a56ff0691174381d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fdc90b57e19734ed0a56ff0691174381d?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb914c973081549beb7ba44e59d827359?format=webp&width=800"
    ],
    description: "Regal TNA design with ornate scrollwork and red TNA logo over globe centerpiece.",
    details: [
      "8mm CNC‑machined plates with ornate etching",
      "Red TNA logo across globe centerpiece",
      "Matching side plates with TNA insignia"
    ]
  },
  {
    id: "30",
    name: "WWE Classic United States Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F56ba66b3e51940e79cfb9c85fb94344f?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F56ba66b3e51940e79cfb9c85fb94344f?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F94dec38de98146e380eb13f9dcda91e7?format=webp&width=800"
    ],
    description: "Bold American flag backdrop with gold accents and WWE logo centerpiece on black strap.",
    details: [
      "Gold‑plated plates with red/white/blue enamel",
      "United States Champion banner",
      "Interchangeable WWE side plates"
    ]
  },
  {
    id: "31",
    name: "WWE Unified Tag Team Championship – Dual Belt Edition",
    price: 1499,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc6b90a3f1cbe4596aef80649e4981b27?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc6b90a3f1cbe4596aef80649e4981b27?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff93c7f5a018048c8a6832183d6cdf54c?format=webp&width=800"
    ],
    description: "Dual Raw/World Tag and SmackDown Tag titles representing unified supremacy.",
    details: [
      "World Tag: red globe centerpiece and wrestling imagery",
      "WWE Tag: blue globe with gold banners",
      "Both on black leather with WWE logo side plates"
    ]
  },
  {
    id: "32",
    name: "WWE Tag Team Championships – Golden Globe Edition",
    price: 1499,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F352a068dfdee46928793db92af30dd95?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F352a068dfdee46928793db92af30dd95?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2f50945bcbdb44399fbdcb47fcbd3bde?format=webp&width=800"
    ],
    description: "Modern unified era set with globe centerpieces, eagle etching and crystal detailing.",
    details: [
      "Raw: circular globe with crystals and interchangeable plates",
      "SmackDown: wider plate with eagle etching and bold banner",
      "24k gold with deep etching; black leather straps"
    ]
  },
  {
    id: "33",
    name: "WWE Women’s Championship – Attitude Era Edition",
    price: 1200,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F5f57aab2f6b440718d5927f061dc0166?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F5f57aab2f6b440718d5927f061dc0166?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe36ca83a1a2245c184070ba976648799?format=webp&width=800"
    ],
    description: "Oval centerpiece with red Women’s Champion lettering and scratch WWE logo.",
    details: [
      "24k oval centerpiece with flame‑style etching",
      "Scratch WWE logo above title banner",
      "Black leather strap with detailed tooling"
    ]
  },
  {
    id: "34",
    name: "WWE ECW Championship – Silver & Black Edition",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb0f868b6d5c145ccbd6e352b8f2ccfc2?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb0f868b6d5c145ccbd6e352b8f2ccfc2?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F11805fd00b734796893339e6662a30f7?format=webp&width=800"
    ],
    description: "Silver‑plated design with massive ECW letters, flame etching and sunburst backdrop.",
    details: [
      "Oversized ECW lettering at center",
      "Flame and spike patterns for hardcore identity",
      "Engraved WWE banner across the top"
    ]
  },
  {
    id: "35",
    name: "WWE Eco‑Friendly Championship – Daniel Bryan Edition",
    price: 899,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc140c3b38bd744a88f1487bb4d63fc8d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc140c3b38bd744a88f1487bb4d63fc8d?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb2b7b132e0aa4b438e94c35de83d6def?format=webp&width=800"
    ],
    description: "Sustainable title featuring wooden centerpiece, hemp strap and blue/white stones.",
    details: [
      "Wooden central plate with carved WWE logo",
      "Hemp‑based strap and custom Daniel Bryan side plates",
      "Blue and white stone detailing"
    ]
  },
  {
    id: "36",
    name: "The Fiend Championship Belt – Custom Edition",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe71a4f9613824994b27a356a31de86e6?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe71a4f9613824994b27a356a31de86e6?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc288be9e0d294d57859d1c1ced3d04ca?format=webp&width=800"
    ],
    description: "Sculpted mask faceplate with haunting eyes and teeth; black strap with HURT/HEAL marks.",
    details: [
      "3D sculpted, hand‑painted mask centerpiece",
      "Black strap with “HURT” and “HEAL” inscriptions",
      "Red stitching to enhance the theme"
    ]
  },
  {
    id: "37",
    name: "Million Dollar Championship",
    price: 1299,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff33f2dedd5354012929918db472ce90a?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff33f2dedd5354012929918db472ce90a?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F87003a68e2c04e2baace2cd3c43d9866?format=webp&width=800"
    ],
    description: "24k gold-plated plates with sparkling crystals and genuine leather strap. A symbol of luxury, power, and prestige that made the Million Dollar Man unforgettable.",
    details: [
      "6mm plates for classic heavyweight feel",
      "Intricate dollar sign engravings with diamond accents",
      "Premium gold-tone finish and raised texture"
    ]
  },
  {
    id: "38",
    name: "Triple AAA Mega Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2ef65ed67c6048ca9e205f95d1e80bfa?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2ef65ed67c6048ca9e205f95d1e80bfa?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F6d4bcc3f41904c95a699f7b4511b9af2?format=webp&width=800"
    ],
    description: "Crafted with precision and passion, this belt represents the spirit of lucha libre excellence with an intricate design inspired by Mexican wrestling heritage.",
    details: [
      "Dual-layered 6mm plates",
      "Authentic AAA logo engraving",
      "Hand-stitched genuine leather strap",
      "Includes display case"
    ]
  },
  {
    id: "39",
    name: "Lucha Underground Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F20c330a56d7240b594a6ac3357f3b4ea?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F20c330a56d7240b594a6ac3357f3b4ea?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb9067473b5694f47befaed0f5c0f01e4?format=webp&width=800"
    ],
    description: "Bold, fierce, and full of attitude — this championship embodies the underground energy of the ring with detailed Aztec motifs and antique gold plating.",
    details: [
      "Antique 24k gold finish",
      "Aztec mask and temple engravings",
      "6mm dual-layer plates"
    ]
  },
  {
    id: "40",
    name: "UFC Heavyweight Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8e368fb251304827a97b7f2adf9eb608?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8e368fb251304827a97b7f2adf9eb608?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F230deb8a21444fd1b7c765ee2b700003?format=webp&width=800"
    ],
    description: "Precision-designed with a mix of gold and black plating. A tribute to the world's top fighters who define strength and discipline.",
    details: [
      "Octagon-inspired central plate",
      "Dual-layer 6mm structure",
      "Genuine leather strap with heavy-duty snaps",
      "Includes custom name engraving"
    ]
  },
  {
    id: "41",
    name: "Divas Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F53dcbf490ff240fd939f27c43e7ef4a0?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F53dcbf490ff240fd939f27c43e7ef4a0?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F52f46213b19b4ccba423e7e158ee993f?format=webp&width=800"
    ],
    description: "A fan-favorite masterpiece with a stunning butterfly centerpiece and brilliant gemstones representing elegance and dominance.",
    details: [
      "Pink crystal-studded butterfly centerpiece",
      "5mm plates for lightweight feel",
      "Genuine leather strap",
      "Includes custom nameplate engraving"
    ]
  },
  {
    id: "42",
    name: "Speed Championship",
    price: 899,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F16dd99014547488d81efa9ed349869d4?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F16dd99014547488d81efa9ed349869d4?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F3fad9bcfa4094711832f198d2a82095a?format=webp&width=800"
    ],
    description: "Modern and sleek, built for those who rise above limits. The Speed Championship captures energy and agility in every detail.",
    details: [
      "Chrome silver finish with racing stripes",
      "Lightweight 5mm plates",
      "Laser-cut precision engravings",
      "Worldwide shipping within 2 weeks"
    ]
  },
  {
    id: "43",
    name: "Evolve Championship",
    price: 899,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F544cdefbe6d8494b9b8b0928e33a669a?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F544cdefbe6d8494b9b8b0928e33a669a?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa5d382e4fa314b7684cca4e8d07d584f?format=webp&width=800"
    ],
    description: "Symbolizing evolution and excellence, this belt stands out with its refined silver plating and sharp geometric design.",
    details: [
      "5mm dual-layer plates",
      "Reflective silver shine",
      "High-grade leather strap",
      "Includes engraved nameplate"
    ]
  },
  {
    id: "44",
    name: "Rated R Spinner Championship",
    price: 1199,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd76669cbabf040d88f624416add7fdf7?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fd76669cbabf040d88f624416add7fdf7?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff56e1fb047284648bbbe312e0079e877?format=webp&width=800"
    ],
    description: "An iconic piece featuring a spinning center plate and red Rated R logo, representing rebellion and attitude.",
    details: [
      "Spinning central plate mechanism",
      "Gloss red Rated R logo",
      "24k gold and silver plating"
    ]
  },
  {
    id: "45",
    name: "WWE Cruiserweight Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc8625f739a874aaf867fb16c1ab50af6?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc8625f739a874aaf867fb16c1ab50af6?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2d2709c994ea439b80ae7855da935bd4?format=webp&width=800"
    ],
    description: "Designed for agility and prestige, this belt features purple highlights and the signature WWE logo in silver finish.",
    details: [
      "5mm plates for lightweight comfort",
      "Silver finish with purple enamel details",
      "Includes engraved nameplate"
    ]
  },
  {
    id: "46",
    name: "Classic 2014 WWE Tag Team Title",
    price: 1299,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb64cd18363904efbb84e32d71963ba2c?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb64cd18363904efbb84e32d71963ba2c?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe44681f54dfb457198825268111a1a94?format=webp&width=800"
    ],
    description: "Revisit tag team glory with these iconic copper-plated titles, crafted with legendary precision and bold dual gladiator emblems.",
    details: [
      "Copper-finished 6mm plates",
      "Dual gladiator engravings",
      "Genuine black leather strap"
    ]
  },
  {
    id: "47",
    name: "24/7 Championship",
    price: 699,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa9902c63fff345bea73fa98595d0d612?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa9902c63fff345bea73fa98595d0d612?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fee6abc9ff8064eb498a0c27bc75665bf?format=webp&width=800"
    ],
    description: "Always on the line, this green leather beauty brings fun and chaos together with an instantly recognizable gold-plated design.",
    details: [
      "Green genuine leather strap",
      "Polished gold-plated centerpiece",
      "5mm plates with lightweight construction"
    ]
  },
  {
    id: "48",
    name: "Crown Jewel Championship",
    price: 1399,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9c3f39db2c78416a9beb15e4a759a2cc?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9c3f39db2c78416a9beb15e4a759a2cc?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F03bec16028c24d5db7762fc058a39b38?format=webp&width=800"
    ],
    description: "A royal masterpiece celebrating excellence and grandeur, inspired by the Crown Jewel event with emerald gemstone detailing.",
    details: [
      "24k gold-plated centerpiece",
      "Embedded emerald stones",
      "Intricate crown and sword engravings"
    ]
  },
  {
    id: "49",
    name: "Classic NXT Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F607a01c541834221bd1ad08212aaca5c?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F607a01c541834221bd1ad08212aaca5c?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe34ce97d1d5247cbb6f204f628d05877?format=webp&width=800"
    ],
    description: "The golden era of NXT captured in one belt. Bold, dominant, and unmatched in its metallic black and gold tone.",
    details: [
      "6mm dual-layer plates",
      "Black and gold contrast finish",
      "Signature NXT logo engraving"
    ]
  },
  {
    id: "50",
    name: "Internet Championship",
    price: 1099,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F6fe8df13d4de42f7bae61cd79dd1578d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F6fe8df13d4de42f7bae61cd79dd1578d?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F55f3ba697fd84a058a571b8797a0383b?format=webp&width=800"
    ],
    description: "An online icon reborn with holographic effects, chrome details, and vibrant purple and blue accents.",
    details: [
      "6mm polished silver plates",
      "Holographic background engraving",
      "Includes personalized nameplate"
    ]
  },
  {
    id: "51",
    name: "Big Gold Brown Strap Edition",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0b4fae6f53c1420caad67c24d391691c?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0b4fae6f53c1420caad67c24d391691c?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe16f0532783b4a699347b088fc0da7bf?format=webp&width=800"
    ],
    description: "A classic twist on the Big Gold legacy with a vintage brown strap and timeworn gold shine, built for collectors.",
    details: [
      "24k aged gold-plated plates",
      "Brown genuine leather strap",
      "Intricate lion and crown engravings"
    ]
  },
  {
    id: "52",
    name: "Undertaker Legacy Title",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc810db1ac2804d1c852de3cad42dc099?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc810db1ac2804d1c852de3cad42dc099?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc3adc6487428456eb768fffa2b3b6d98?format=webp&width=800"
    ],
    description: "Dark, powerful, and iconic. This legacy belt honors the Phenom with purple undertones and gothic engravings.",
    details: [
      "6mm antique silver plates",
      "Purple highlights and custom side plates",
      "Hand-tooled genuine leather strap",
      "Includes exclusive Undertaker nameplate"
    ]
  },
  {
    id: "53",
    name: "WWF European Championship",
    price: 999,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8e0e048f932d4a41946d9052689c1a87?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8e0e048f932d4a41946d9052689c1a87?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9d704381117c4ae6a39090472d21a63b?format=webp&width=800"
    ],
    description: "A timeless collector's piece celebrating international glory with detailed European map engraving and national flags.",
    details: [
      "6mm dual-layer gold plates",
      "European continent engravings",
      "Includes engraved champion nameplate"
    ]
  },
  {
    id: "54",
    name: "WWF Cruiserweight Championship",
    price: 1099,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc8625f739a874aaf867fb16c1ab50af6?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc8625f739a874aaf867fb16c1ab50af6?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F2d2709c994ea439b80ae7855da935bd4?format=webp&width=800"
    ],
    description: "A classic throwback to the early cruiserweight era, this WWF edition features silver plating, red accents, and a timeless globe centerpiece representing speed and honor.",
    details: [
      "6mm dual-layer silver plates",
      "Red enamel detailing with WWF logo engraving",
      "Classic globe centerpiece design"
    ]
  },
  {
    id: "55",
    name: "NXT North American Title",
    price: 899,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F824c1438199a42c5bde3447765790139?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F824c1438199a42c5bde3447765790139?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Feede575a2b424256a28e5b7ab0919de2?format=webp&width=800"
    ],
    description: "Bold red centerpiece and bronze plating make this title a must-have for collectors and NXT fans alike.",
    details: [
      "6mm gold dual-layer plates",
      "Brown leather strap",
      "Globe centerpiece design"
    ]
  },
  {
    id: "56",
    name: "Custom Championship (Design Your Own)",
    price: 1500,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff00d33451ee1473e91c253f1ed259311?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff00d33451ee1473e91c253f1ed259311?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8e632876613441fbb5f9e8e17e386267?format=webp&width=800"
    ],
    description: "Fully personalized title: plates, logos, text, colors and strap styles made to your spec.",
    details: [
      "Design a brand-new belt or modify an existing title",
      "Full control over plates, finish, engravings and stones",
      "Genuine leather straps with gold-plated hardware"
    ]
  }
];
const MERCH_PRODUCTS = [
  {
    id: "T01",
    name: "Roman Reigns OTC Merch",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8678c579243c47f4939bcde4ce884623?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F8678c579243c47f4939bcde4ce884623?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T02",
    name: "Team NEXUS",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F27b49c65513b46e1838a784b61d9879b?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F27b49c65513b46e1838a784b61d9879b?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T03",
    name: "UNDERTAKER 21-1 Shirt",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb700bbb968d34363b79324b910326780?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb700bbb968d34363b79324b910326780?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T04",
    name: "Monday Night Raw",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ffc8539be2cd64364b107f86d82dab546?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ffc8539be2cd64364b107f86d82dab546?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T05",
    name: "Royal Rumble Riyadh",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F729c9dc6362e4daa88fcc38da8fb373e?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F729c9dc6362e4daa88fcc38da8fb373e?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T06",
    name: "WWE 2K26",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa2ddc41362f74bea815b105ecec4a388?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa2ddc41362f74bea815b105ecec4a388?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T07",
    name: "Wrestlemania 43",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff7c824cb7c6c459298f3b20ab10729db?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff7c824cb7c6c459298f3b20ab10729db?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T08",
    name: "CM Punk X Merch",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F71e04cf0a39d4bfab291877a54de27dc?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F71e04cf0a39d4bfab291877a54de27dc?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T09",
    name: "John Cena 17x",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0ee4ecf2faca4447b3e3ad0a4688d45f?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F0ee4ecf2faca4447b3e3ad0a4688d45f?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T10",
    name: "Austin 316 Merch",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa719734de97642249a238f0c25c80aeb?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fa719734de97642249a238f0c25c80aeb?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T11",
    name: "WWF Merch",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F4ea6eafcbbee407389475926a19198e5?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F4ea6eafcbbee407389475926a19198e5?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T12",
    name: "Y2J",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe5f408b7d615461d8ddcc9ab13d71fe8?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe5f408b7d615461d8ddcc9ab13d71fe8?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T13",
    name: "CM Punk and AJ Lee Collab",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F6a2bf4622d1845ddab42616fc275f5ea?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F6a2bf4622d1845ddab42616fc275f5ea?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T14",
    name: "Liv and Dom Collab",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F12cbea19e4484101846a6dc19dd00c67?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F12cbea19e4484101846a6dc19dd00c67?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T15",
    name: "The Shield",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc61ee4b234284a06ac9acc93f7b30a33?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fc61ee4b234284a06ac9acc93f7b30a33?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T16",
    name: "The Beast Brock Lesnar",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F5d4af3edb1494a768ebe96b9b1384b36?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F5d4af3edb1494a768ebe96b9b1384b36?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T17",
    name: "D-Generation X",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F638dfc3ae444414a9b7e51f021c65a85?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F638dfc3ae444414a9b7e51f021c65a85?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T18",
    name: "ECW Merch",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9d96e9e8472246c59cb41a43a532fd7f?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F9d96e9e8472246c59cb41a43a532fd7f?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T19",
    name: "Shawn Michaels",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ffc0907f98c69471a935660a2b8b0f3ee?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ffc0907f98c69471a935660a2b8b0f3ee?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T20",
    name: "Seth Rollins OG Merch",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1b06330947e34456a9743f3b975553ac?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F1b06330947e34456a9743f3b975553ac?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T21",
    name: "Fight Owens FIght",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fcdafa6976ae74a149e33d5d952059c60?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fcdafa6976ae74a149e33d5d952059c60?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T22",
    name: "The Big Red Monster",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F49beb907e9144252aa269f3fff950654?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F49beb907e9144252aa269f3fff950654?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T23",
    name: "Undisputed Era Merch",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F7add8bc405ba465a8b632e35e88acb7d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F7add8bc405ba465a8b632e35e88acb7d?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T24",
    name: "Smackdown Fist",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb5948ec8e4b94313885a78dd3e667767?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fb5948ec8e4b94313885a78dd3e667767?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T25",
    name: "New World Order",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F31ebde57e67c4c5883d78f88b1dff914?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2F31ebde57e67c4c5883d78f88b1dff914?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T26",
    name: "Evolution",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe58260ef42e34f52bddf82e709d78e87?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Fe58260ef42e34f52bddf82e709d78e87?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T27",
    name: "WWE Smackdown Tshirt",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2F172f2a8178964fd4879b47b6f5fb67a8%2Fefbb655b93dd4beb8efab3016a9ca669?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F172f2a8178964fd4879b47b6f5fb67a8%2Fefbb655b93dd4beb8efab3016a9ca669?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  },
  {
    id: "T28",
    name: "WWE Raw Tshirt",
    price: 29.99,
    image: "https://cdn.builder.io/api/v1/image/assets%2F172f2a8178964fd4879b47b6f5fb67a8%2F89d7867db140472a801472ad27a82635?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F172f2a8178964fd4879b47b6f5fb67a8%2F89d7867db140472a801472ad27a82635?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2Fceda48cacd9a4a349cddd2c8eeadcb80%2Ff6c0e51227034ae1aa3bafef3194f152?format=webp&width=800"
    ],
    description: "Pro Wrestling Merch",
    details: [
      "Available sizes: XS, S, M, L, XL",
      "Premium quality print",
      "Comfortable fit"
    ],
    soldOut: false
  }
];
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey) {
  try {
    stripe = new Stripe(stripeKey);
    console.log("[Stripe] Initialized successfully");
  } catch (err) {
    console.error("[Stripe] Failed to initialize:", err);
  }
}
const ALL_PRODUCTS$1 = [...PRODUCTS, ...MERCH_PRODUCTS];
function calculateTotal$1(items, voucherCode) {
  const subtotal = items.reduce((sum, { id, quantity }) => {
    const product = ALL_PRODUCTS$1.find((p) => p.id === id);
    if (!product) throw new Error(`Invalid product ID: ${id}`);
    return sum + product.price * quantity;
  }, 0);
  const voucher = VOUCHERS.find((v) => v.code === voucherCode);
  let discount = 0;
  if (voucher) {
    discount = voucher.type === "percentage" ? subtotal * (voucher.discount / 100) : voucher.discount;
  }
  const delivery = DELIVERY_COST;
  return {
    subtotal,
    discount,
    delivery,
    total: Math.max(0, subtotal - discount + delivery)
  };
}
const handleStripeCheckout = async (req, res) => {
  console.log("[Stripe] handleStripeCheckout called");
  console.log("[Stripe] Request body:", req.body);
  try {
    if (!stripe || !stripeKey) {
      console.error(
        "[Stripe] Not configured - stripe:",
        !!stripe,
        "key:",
        !!stripeKey
      );
      return res.status(400).json({
        error: "Stripe is not configured. Please contact support."
      });
    }
    console.log("[Stripe] Received checkout request");
    const { items, voucherCode, customerData, orderNumber } = req.body;
    console.log("[Stripe] Items received:", items);
    console.log("[Stripe] Voucher code:", voucherCode);
    console.log("[Stripe] Customer data received:", customerData);
    console.log("[Stripe] Order number received:", orderNumber);
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("[Stripe] Invalid items:", items);
      return res.status(400).json({ error: "Invalid items array" });
    }
    console.log("[Stripe] Processing items:", items.length);
    const line_items = items.map(({ id, quantity }) => {
      const product = ALL_PRODUCTS$1.find((p) => p.id === id);
      if (!product) {
        throw new Error(`Product not found: ${id}`);
      }
      if (!quantity || quantity < 1) {
        throw new Error(`Invalid quantity for product ${id}`);
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image]
          },
          unit_amount: Math.round(product.price * 100)
        },
        quantity
      };
    });
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery (2 weeks)",
          description: "Standard worldwide shipping - delivery within 2 weeks"
        },
        unit_amount: Math.round(DELIVERY_COST * 100)
      },
      quantity: 1
    });
    console.log("[Stripe] Built line items:", line_items.length);
    const totals = calculateTotal$1(items, voucherCode);
    console.log("[Stripe] Calculated totals:", totals);
    let couponId;
    if (voucherCode) {
      const voucher = VOUCHERS.find((v) => v.code === voucherCode);
      if (voucher) {
        try {
          console.log("[Stripe] Creating coupon for voucher:", voucherCode);
          const coupon = await stripe.coupons.create({
            amount_off: Math.round(totals.discount * 100),
            currency: "usd",
            duration: "once",
            name: `VOUCHER_${Date.now()}`
          });
          couponId = coupon.id;
          console.log("[Stripe] Coupon created:", couponId);
        } catch (couponErr) {
          console.warn("[Stripe] Coupon creation failed:", couponErr.message);
        }
      }
    }
    const protocol = req.protocol || "https";
    const host = req.get("host") || "www.burnitdownyt.com";
    const baseUrl = `${protocol}://${host}`;
    console.log("[Stripe] Building URLs with baseUrl:", baseUrl);
    const success_url = `${baseUrl}/bill?provider=stripe&session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${baseUrl}/checkout?cancelled=true`;
    console.log("[Stripe] Success URL:", success_url);
    console.log("[Stripe] Cancel URL:", cancel_url);
    let customerId;
    if (customerData?.email && stripe) {
      try {
        console.log(
          "[Stripe] Creating customer for email:",
          customerData.email
        );
        const customer = await stripe.customers.create({
          email: customerData.email,
          name: customerData.name || void 0,
          phone: customerData.phone || void 0,
          metadata: {
            orderNumber: orderNumber || ""
          }
        });
        customerId = customer.id;
        console.log("[Stripe] Customer created:", customerId);
      } catch (customerErr) {
        console.warn("[Stripe] Customer creation failed:", customerErr.message);
      }
    }
    console.log("[Stripe] Creating checkout session");
    const sessionParams = {
      mode: "payment",
      payment_method_types: ["card", "apple_pay"],
      line_items,
      discounts: couponId ? [{ coupon: couponId }] : void 0,
      success_url,
      cancel_url,
      customer: customerId || void 0,
      customer_email: !customerId ? customerData?.email || void 0 : void 0,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW", "ZZ"]
      },
      metadata: {
        orderNumber: orderNumber || "",
        voucherCode: voucherCode || "",
        itemCount: items.length.toString()
      }
    };
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("[Stripe] Session created:", session.id);
    if (!session.url) {
      console.error("[Stripe] No URL in session");
      throw new Error("Stripe session created but no URL returned");
    }
    console.log("[Stripe] Returning checkout URL");
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[Stripe] Checkout error:", {
      message: err.message,
      type: err.type,
      statusCode: err.statusCode
    });
    let errorMsg = "Payment processing failed";
    if (err.type === "StripeInvalidRequestError") {
      errorMsg = err.message || "Invalid payment details";
    } else if (err.message?.includes("line_items")) {
      errorMsg = "Invalid product information";
    }
    res.status(400).json({ error: errorMsg });
  }
};
const handleStripeVerify = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: "Payment provider not configured" });
    }
    const session_id = req.query.session_id;
    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === "paid" && session.status === "complete";
    res.json({ paid, session });
  } catch (err) {
    console.error("[Stripe] Verify error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const isSandbox = (clientId) => {
  if (!clientId) return true;
  return clientId.length < 60 || clientId.includes("sb_");
};
const PAYPAL_API_BASE = isSandbox(PAYPAL_CLIENT_ID) ? "https://api.sandbox.paypal.com" : "https://api.paypal.com";
let accessToken = null;
let tokenExpiry = 0;
async function getPayPalAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }
  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");
    const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    if (!tokenResponse.ok) {
      throw new Error(
        `PayPal token request failed: ${tokenResponse.statusText}`
      );
    }
    const tokenData = await tokenResponse.json();
    accessToken = tokenData.access_token;
    tokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1e3;
    console.log("[PayPal] Access token obtained successfully");
    return accessToken;
  } catch (err) {
    console.error("[PayPal] Failed to get access token:", err.message);
    throw err;
  }
}
if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
  console.log("[PayPal] Initialized successfully with new SDK");
} else {
  console.error("[PayPal] Missing PayPal credentials");
}
const ALL_PRODUCTS = [...PRODUCTS, ...MERCH_PRODUCTS];
function calculateTotal(items, voucherCode) {
  const subtotal = items.reduce((sum, { id, quantity }) => {
    const p = ALL_PRODUCTS.find((prod) => prod.id === id);
    if (!p) throw new Error(`Invalid product ID: ${id}`);
    return sum + p.price * quantity;
  }, 0);
  const voucher = VOUCHERS.find((v) => v.code === voucherCode);
  let discount = 0;
  if (voucher) {
    discount = voucher.type === "percentage" ? subtotal * (voucher.discount / 100) : voucher.discount;
  }
  const delivery = DELIVERY_COST;
  return {
    subtotal,
    discount,
    delivery,
    total: Math.max(0, subtotal - discount + delivery)
  };
}
const handlePayPalCheckout = async (req, res) => {
  console.log("[PayPal] handlePayPalCheckout called");
  console.log("[PayPal] Request body:", req.body);
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error("[PayPal] Credentials not configured");
      return res.status(400).json({
        error: "PayPal is not configured. Please contact support."
      });
    }
    const { items, voucherCode, customerData, orderNumber } = req.body;
    console.log("[PayPal] Items received:", items);
    console.log("[PayPal] Voucher code:", voucherCode);
    console.log("[PayPal] Customer data received:", customerData);
    console.log("[PayPal] Order number received:", orderNumber);
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("[PayPal] Invalid items:", items);
      return res.status(400).json({ error: "Invalid items array" });
    }
    console.log("[PayPal] Processing items:", items.length);
    for (const item of items) {
      const product = ALL_PRODUCTS.find((p) => p.id === item.id);
      if (!product) throw new Error(`Product not found: ${item.id}`);
      if (item.quantity < 1) throw new Error("Invalid quantity");
    }
    const totals = calculateTotal(items, voucherCode);
    console.log("[PayPal] Calculated totals:", totals);
    const itemList = items.map((item) => {
      const product = ALL_PRODUCTS.find((p) => p.id === item.id);
      return {
        name: product?.name || `Item ${item.id}`,
        unit_amount: {
          currency_code: "USD",
          value: (product?.price || 0).toFixed(2)
        },
        quantity: item.quantity.toString(),
        category: "PHYSICAL_GOODS"
      };
    });
    itemList.push({
      name: "Delivery (2 weeks)",
      description: "Standard worldwide shipping - delivery within 2 weeks",
      unit_amount: {
        currency_code: "USD",
        value: DELIVERY_COST.toFixed(2)
      },
      quantity: "1",
      category: "PHYSICAL_GOODS"
    });
    console.log("[PayPal] Item list:", itemList);
    const finalOrderNumber = orderNumber || `WWE-${Date.now().toString().slice(-6)}`;
    const protocol = req.protocol || "https";
    const host = req.get("host") || "www.burnitdownyt.com";
    const baseUrl = `${protocol}://${host}`;
    console.log("[PayPal] Building URLs with baseUrl:", baseUrl);
    console.log("[PayPal] Final order number:", finalOrderNumber);
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: finalOrderNumber,
          items: itemList,
          amount: {
            currency_code: "USD",
            value: totals.total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totals.subtotal.toFixed(2)
              },
              shipping: {
                currency_code: "USD",
                value: totals.delivery.toFixed(2)
              },
              ...totals.discount > 0 && {
                discount: {
                  currency_code: "USD",
                  value: totals.discount.toFixed(2)
                }
              }
            }
          }
        }
      ],
      application_context: {
        return_url: `${baseUrl}/bill?provider=paypal&orderId=${finalOrderNumber}`,
        cancel_url: `${baseUrl}/checkout?cancelled=true`,
        brand_name: "BURNITDOWNYT",
        locale: "en-US",
        user_action: "PAY_NOW",
        shipping_preference: "GET_FROM_FILE"
      }
    };
    console.log("[PayPal] Creating order with payload:", JSON.stringify(orderPayload, null, 2));
    let order;
    try {
      const token = await getPayPalAccessToken();
      console.log("[PayPal] Using access token for order creation");
      const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": finalOrderNumber
        },
        body: JSON.stringify(orderPayload)
      });
      console.log("[PayPal] Order response status:", orderResponse.status);
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error(
          "[PayPal] Order creation failed:",
          orderResponse.status,
          errorText
        );
        let errorDetail = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          console.error("[PayPal] Error details:", errorJson);
          errorDetail = errorJson.message || errorJson.error_description || errorText;
        } catch (e) {
        }
        throw new Error(`PayPal API error: ${errorDetail}`);
      }
      order = await orderResponse.json();
      console.log("[PayPal] Order created:", order.id);
      console.log("[PayPal] Order status:", order.status);
      console.log("[PayPal] Order links:", order.links);
    } catch (executeErr) {
      console.error("[PayPal] Execute error:", {
        message: executeErr.message
      });
      throw executeErr;
    }
    const approveLink = (order?.links || []).find(
      (l) => l.rel === "approve"
    );
    const approveUrl = approveLink?.href;
    if (!approveUrl) {
      console.error(
        "[PayPal] No approve URL in response. Order:",
        JSON.stringify(order, null, 2)
      );
      throw new Error("No approve URL in PayPal response");
    }
    console.log("[PayPal] Returning approve URL");
    res.json({ approveUrl, orderId: order.id });
  } catch (err) {
    console.error("[PayPal] Checkout error:", {
      message: err.message,
      statusCode: err.statusCode,
      body: err.body
    });
    res.status(400).json({ error: err.message || "PayPal order creation failed" });
  }
};
const handlePayPalCapture = async (req, res) => {
  console.log("[PayPal] handlePayPalCapture called");
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error("[PayPal] Credentials not configured");
      return res.status(400).json({ error: "PayPal is not configured" });
    }
    const { orderId } = req.query;
    if (!orderId || typeof orderId !== "string") {
      console.error("[PayPal] Missing orderId");
      return res.status(400).json({ error: "Missing orderId" });
    }
    console.log("[PayPal] Capturing order:", orderId);
    try {
      const token = await getPayPalAccessToken();
      const captureResponse = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        }
      );
      if (!captureResponse.ok) {
        const errorText = await captureResponse.text();
        console.error(
          "[PayPal] Order capture failed:",
          captureResponse.status,
          errorText
        );
        throw new Error(`PayPal order capture failed: ${errorText}`);
      }
      const order = await captureResponse.json();
      console.log("[PayPal] Order captured:", order.id);
      console.log("[PayPal] Order status:", order.status);
      const paid = order.status === "COMPLETED";
      res.json({ paid, order });
    } catch (err) {
      console.error("[PayPal] Capture error:", err.message);
      throw err;
    }
  } catch (err) {
    console.error("[PayPal] Capture error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
function createServer() {
  const app2 = express();
  app2.use(cors());
  app2.use(express.json());
  app2.use(express.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.post("/api/stripe/create-session", handleStripeCheckout);
  app2.get("/api/stripe/verify-session", handleStripeVerify);
  app2.post("/api/paypal/create-order", handlePayPalCheckout);
  app2.get("/api/paypal/capture", handlePayPalCapture);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(
  express.static(distPath, {
    // Don't serve index.html for unknown paths
    index: false,
    // Serve everything else normally
    extensions: [
      "js",
      "css",
      "svg",
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "woff",
      "woff2"
    ]
  })
);
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    console.log(
      `[Production] API endpoint not found: ${req.method} ${req.path}`
    );
    return res.status(404).json({ error: "API endpoint not found" });
  }
  const indexPath = path.join(distPath, "index.html");
  console.log(
    `[Production] Serving SPA: ${req.method} ${req.path} -> ${indexPath}`
  );
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`[Production] Failed to serve index.html:`, err.message);
      res.status(500).json({ error: "Failed to load application" });
    }
  });
});
const server = app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
//# sourceMappingURL=node-build.mjs.map
