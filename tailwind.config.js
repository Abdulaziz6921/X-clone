/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: "#1DA1F2",
          "blue-dark": "#1991DB",
          "blue-light": "#8ED8F8",
          black: "#14171A",
          "dark-gray": "#657786",
          "light-gray": "#AAB8C2",
          "extra-light-gray": "#E1E8ED",
          "extra-extra-light-gray": "#F7F9FA",
        },
        dark: {
          bg: "#000000",
          "bg-secondary": "#16181C",
          "bg-tertiary": "#1C1F23",
          text: "#FFFFFF",
          "text-secondary": "#8B98A5",
          border: "#2F3336",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
