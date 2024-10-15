/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    theme: {
      extend: {
        fontFamily: {
          roboto: ['Roboto', 'sans-serif']
        }
      }
    }
  }