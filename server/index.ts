import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleStripeCheckout, handleStripeVerify } from "./routes/stripe";
import { handlePayPalCheckout, handlePayPalCapture } from "./routes/paypal";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Payment routes
  app.post("/api/stripe/create-session", handleStripeCheckout);
  app.get("/api/stripe/verify-session", handleStripeVerify);
  app.post("/api/paypal/create-order", handlePayPalCheckout);
  app.get("/api/paypal/capture", handlePayPalCapture);

  return app;
}
