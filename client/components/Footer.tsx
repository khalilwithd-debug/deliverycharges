import { motion } from "framer-motion";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) el2.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  };
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-black text-white py-12 px-6 font-space"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gray-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("shop")}
                  className="hover:text-gray-300 transition-colors"
                >
                  Shop
                </button>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/g/1FNLn37Fvm/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  2K Community
                </a>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1NYbtlrr0m_L64UMf7SP6k8dqafEjyvhe/view?usp=drivesdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors"
                >
                  Media Kit
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-gray-300 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/burnitdownyt?igsh=MTExOGNwOHJhZWYyYQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6 cursor-pointer hover:text-gray-300 transition-colors" />
              </a>
              <a
                href="https://www.facebook.com/share/g/1FNLn37Fvm/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-6 h-6 cursor-pointer hover:text-gray-300 transition-colors" />
              </a>
              <a
                href="https://youtube.com/@burnitdownyt?si=M1570QuonyesV4R-"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-6 h-6 cursor-pointer hover:text-gray-300 transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact Details</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Phone: +1 929 6129 615</li>
              <li>Address: 719 2nd Ave, New York NY 10016</li>
              <li>
                Email:{" "}
                <a href="mailto:burnitdownyt@gmail.com" className="underline">
                  burnitdownyt@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 BURNITDOWNYT. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};
