import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mf: {
          green: "#22c55e",
          red: "#ef4444",
          light: "#f0fdf4",
        }
      }
    },
  },
  plugins: [],
} satisfies Config;