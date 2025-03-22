// import { serve } from "bun";
// import index from "./index.html";
// import { products } from "./data/products";
//
// const server = serve({
//   fetch: (req) => {
//     const url = new URL(req.url);
//     const method = req.method;
//
//     if (url.pathname === "/api/products") {
//       return new Response(JSON.stringify(products), {
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//
//     if (url.pathname === "/api/audit-logs" && method === "POST") {
//       return Response.json({
//         success: true,
//         id: `mock-${Date.now()}`,
//         timestamp: new Date().toISOString(),
//       });
//     }
//     return fetch(req);
//   },
//   routes: {
//     // Serve index.html for all unmatched routes.
//     "/*": index,
//     "/api/products": async (req) => {
//       return Response.json(products);
//     },
//   },
//   development: process.env.NODE_ENV !== "production",
// });
//
// console.log(`🚀 Server running at ${server.url}`);
