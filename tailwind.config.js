/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,pages,components,src}/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#010e5a",
        "secondary-blue": "#00042f",
        "highlight-blue": "#0066ff",
        "accent-blue": "#071495",
      },
      fontFamily: {
        primary: ["Unbounded", "sans-serif"],
        secondary: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
