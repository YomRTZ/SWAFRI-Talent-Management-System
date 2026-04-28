export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        bg: "#1e263e",
        surface: "#2a3354",
        fg: "#151a2e",
      },
    },
  },
  plugins: [],
};