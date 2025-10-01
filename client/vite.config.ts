import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import cesium from "vite-plugin-cesium";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 5000,
  },
  plugins: [
    react(),
    cesium(),
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            {
              name: "removeAttrs",
              params: {
                attrs: "(fill)",
              },
            },
          ],
        },
        icon: true,
        memo: true,
        prettier: true,
      },
      include: "src/assets/*.svg?react",
    }),
  ],
});
