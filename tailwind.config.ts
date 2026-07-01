import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atres: {
          black: "#050706",
          forest: "#07140f",
          panel: "#0d1712",
          border: "#1d3328",
          green: "#18c477",
          gold: "#d8b35a",
          muted: "#99aa9f",
        },
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
