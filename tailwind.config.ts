import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6F8FB",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#D4A017", // Matrix IoT Gold
          light: "#FDF7E7",
          dark: "#B8860B",
        },
        gold: {
          DEFAULT: "#D4A017",
          light: "#FEF7E7",
          dark: "#A67C1E",
          metallic: "#C5A059",
        },
        teal: {
          DEFAULT: "#36A69A",
          light: "#E8F6F4",
        },
        violet: {
          DEFAULT: "#8069F2",
          light: "#F0EEFE",
        },
        green: {
          DEFAULT: "#38A169",
          light: "#EBF8F1",
        },
        amber: {
          DEFAULT: "#E8A317",
          light: "#FEF7E7",
        },
        coral: {
          DEFAULT: "#E86A6A",
          light: "#FDF0F0",
        },
        slate: {
          900: "#172033",
          600: "#475467",
          500: "#667085",
          400: "#98A2B3",
          200: "#EAECF0",
          100: "#F2F4F7",
          50: "#F8F9FC",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'ios': '0 4px 20px -2px rgba(23, 32, 51, 0.05), 0 2px 6px -1px rgba(23, 32, 51, 0.03)',
        'ios-hover': '0 12px 32px -4px rgba(212, 160, 23, 0.15), 0 4px 12px -2px rgba(23, 32, 51, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
};
export default config;
