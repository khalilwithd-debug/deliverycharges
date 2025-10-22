import serverless from "serverless-http";
import { createServer } from "../../server/index";

const app = createServer();

// Wrap Express app with serverless-http for Netlify Functions
export const handler = serverless(app);
