/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        warm: {
          50: "#faf8f3",
          100: "#f5f1e8",
          200: "#ede6d9",
          300: "#e0d4bf",
          400: "#d4bfa8",
          500: "#c9aa91",
          600: "#b8927a",
          700: "#9d7d68",
          800: "#7d6456",
          900: "#5d4a42",
        },
        accent: {
          light: "#fef3c7",
          DEFAULT: "#fcd34d",
          dark: "#f59e0b",
        },
      },
      fontFamily: {
        sans: [
          "ui-rounded",
          "Hiragino Maru Gothic ProN",
          "Quicksand",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 15px rgba(0, 0, 0, 0.08)",
        softer: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};