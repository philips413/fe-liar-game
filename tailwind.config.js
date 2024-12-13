/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flyonui/flyonui.js'],
  plugins: [require('flyonui'), require('flyonui/plugin')],
  theme: {
    extend: {},
  },
  flyonui: {
    themes: ['light', 'dark', 'gourmet', 'corporate', 'luxury', 'soft'],
  },
};
