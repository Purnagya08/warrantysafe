/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        navy: {
          primary: "#131921",
          secondary: "#232F3E",
        },
        accent: {
          orange: "#FF9900",
          hover: "#F3A847",
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
