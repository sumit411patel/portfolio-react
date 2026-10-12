/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['PT Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      },
      colors: {
        accent: '#FF6B2B',
        'accent-light': '#FF8F5C'
      }
    }
  },
  plugins: [],
}
