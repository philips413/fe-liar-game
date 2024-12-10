/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{html,js}",
    './node_modules/flyonui/dist/js/*.js',
    "./node_modules/flyonui/dist/js/accordion.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flyonui'),
    require('flyonui/plugin')
  ],
}

