/* eslint-env node */
/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    plugins: [],
    theme: {
      extend: {
        fontFamily: {
          roboto: ['Roboto', 'sans-serif']
        }
      }
    }
  }
