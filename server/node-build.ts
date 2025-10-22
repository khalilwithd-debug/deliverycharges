import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files (but not .html files - those are handled by catch-all)
// This ensures static assets like .js, .css, images work correctly
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
      "woff2",
    ],
  }),
);

// Note: API routes are already registered in createServer() from server/index.ts
// They are registered BEFORE this static middleware, so they will be matched first

// Handle React Router - serve index.html for all non-API routes
// This catch-all comes last after all other routes and middleware
app.use((req, res) => {
  // Verify this isn't an API route that should 404
  if (req.path.startsWith("/api/")) {
    console.log(
      `[Production] API endpoint not found: ${req.method} ${req.path}`,
    );
    return res.status(404).json({ error: "API endpoint not found" });
  }

  // Serve index.html for all other routes (SPA routing)
  const indexPath = path.join(distPath, "index.html");
  console.log(
    `[Production] Serving SPA: ${req.method} ${req.path} -> ${indexPath}`,
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

// Graceful shutdown
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
