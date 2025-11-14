// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from 'tailwindcss'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// })

import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Avoid Vite dependency optimization trying to pre-bundle native bindings
  // (lightningcss ships a native pkg that sometimes cannot be resolved on Windows/ESBuild)
  optimizeDeps: {
    exclude: ["lightningcss", "@parcel/wrangler"]
  },
  ssr: {
    // Ensure SSR build doesn't try to externalize/resolve the native package
    noExternal: ["lightningcss"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})