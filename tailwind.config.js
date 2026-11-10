/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './assets/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: { vazir: ['Vazirmatn', 'sans-serif'] },
      colors: {
        space: {
          950: '#03040b',
          900: '#070a18',
          800: '#0e1530'
        }
      }
    }
  },
  plugins: []
};
