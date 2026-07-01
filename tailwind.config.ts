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
          primary: "#143D2B",
          "primary-light": "#1F5A3E",
          "primary-hover": "#2A6B4D",
          gold: "#C8A76A",
          bg: "#F8F8F8",
          text: "#1A1A1A",
          muted: "#6B7280",
          border: "#E5E7EB",
          surface: "#FFFFFF",
          panel: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(20, 61, 43, 0.08)",
        header: "0 2px 12px rgba(0, 0, 0, 0.06)",
        card: "0 2px 16px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 8px 28px rgba(20, 61, 43, 0.12)",
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      animation: {
        fade: "fade 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
