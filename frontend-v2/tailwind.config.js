const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx,ts,tsx,vue}',
    './components/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
    colors: {
      'gamefiDark': {
        300: '#555d78',
        400: '#4a5169',
        500: '#40465a',
        600: '#353a4b',
        700: '#1B1D26',
        800: '#20232d',
        900: '#15171E'
      },
      'gamefiGreen': {
        400: '#72F34B',
        500: '#6CDB00',
      },
      ...colors
    }
  },
  plugins: [],
}
