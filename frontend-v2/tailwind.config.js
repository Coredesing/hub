// eslint-disable-next-line @typescript-eslint/no-var-requires
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
        DEFAULT: '#15171E',
        '300': '#555d78',
        '400': '#4a5169',
        '500': '#40465a',
        '600': '#353a4b',
        '700': '#24262F',
        '800': '#20232d',
        '900': '#15171E'
      },
      'gamefiGreen': {
        DEFAULT: '#72F34B',
        '50': '#F9FEF7',
        '100': '#EAFDE4',
        '200': '#CCFBBE',
        '300': '#AEF898',
        '400': '#90F671',
        '500': '#72F34B',
        '600': '#49EF16',
        '700': '#37C10D',
        '800': '#288C09',
        '900': '#195806'
      },
      'gamefiYellow': {
        DEFAULT: '#FFA800'
      },
      ...colors
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("@tailwindcss/aspect-ratio")
  ],
}
