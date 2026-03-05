// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add any other directories you use (e.g., "./lib/**/*.{js,ts,jsx,tsx}")
  ],
  theme: {
    extend: {
      fontFamily: {
        // Inter becomes the default sans font
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        // Poppins is available as a separate utility
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
}