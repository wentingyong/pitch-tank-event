import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const htmlShell = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>PitchTank · Trade</title>
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%228%22 fill=%22%23070B12%22/%3E%3Ccircle cx=%2216%22 cy=%2216%22 r=%2210%22 fill=%22%2323D6FF%22/%3E%3C/svg%3E" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

const joinBase = (base, fileName) => `${base.endsWith("/") ? base : `${base}/`}${fileName}`;

const virtualHtmlPlugin = () => {
  let base = "/";

  return {
    name: "virtual-html-shell",
    configResolved(config) {
      base = config.base || "/";
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];

        if (url !== "/" && url !== "/index.html") {
          next();
          return;
        }

        const html = await server.transformIndexHtml(url, htmlShell);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    },
    generateBundle(_, bundle) {
      const entry = Object.values(bundle).find(
        (item) => item.type === "chunk" && item.isEntry
      );
      const cssAssets = Object.values(bundle).filter(
        (item) => item.type === "asset" && item.fileName.endsWith(".css")
      );

      if (!entry) {
        this.error("Unable to generate index.html because no entry chunk was emitted.");
      }

      const cssLinks = cssAssets
        .map((asset) => `    <link rel="stylesheet" href="${joinBase(base, asset.fileName)}" />`)
        .join("\n");

      const builtHtml = htmlShell
        .replace('    <script type="module" src="/src/main.jsx"></script>', "")
        .replace(
          "  </head>",
          `${cssLinks ? `${cssLinks}\n` : ""}  </head>`
        )
        .replace(
          "  </body>",
          `    <script type="module" crossorigin src="${joinBase(base, entry.fileName)}"></script>\n  </body>`
        );

      this.emitFile({
        type: "asset",
        fileName: "index.html",
        source: builtHtml,
      });
    },
  };
};

export default defineConfig({
  plugins: [virtualHtmlPlugin(), react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: "src/main.jsx",
    },
  },
});
