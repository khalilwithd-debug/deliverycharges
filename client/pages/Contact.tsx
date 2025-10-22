import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InfoSection } from "@/components/InfoSection";
import { CartSidebar } from "@/components/CartSidebar";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message submitted successfully");
    setForm({ name: "", email: "", contact: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <InfoSection />
      <Header />
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          Contact Us
        </motion.h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
            <p>
              <strong>Phone:</strong> +1 929 6129 615
            </p>
            <p>
              <strong>Address:</strong> 719 2nd Ave, New York NY 10016
            </p>
            <p>
              <strong>Email:</strong> burnitdownyt@gmail.com
            </p>
          </div>
          <form
            onSubmit={submit}
            className="bg-white rounded-lg shadow p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <input
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border rounded p-2 min-h-28"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
      <Footer />
      <CartSidebar />
    </div>
  );
}
