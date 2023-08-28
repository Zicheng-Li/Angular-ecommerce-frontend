/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {
      backgroundImage:{
        'my-img' : "url('./assets/images/back.jpg')"
      }
    },
  },
  plugins: [],
}

