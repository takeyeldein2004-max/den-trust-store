/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "den-navy": "#1E3A8A",
        "den-red": "#B91C1C",
        "den-light-blue": "#BFDBFE",
      },
    },
  },
  plugins: [],
}