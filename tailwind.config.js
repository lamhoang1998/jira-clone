/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "detail-search-bg": "rgb(250, 250, 250)",
        "detail-border-bg": "rgb(223, 225, 235)",
      },
    },
  },
  plugins: [],
};
