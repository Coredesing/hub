// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx,ts,tsx,vue}',
    './components/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
        fontFamily: {
            'casual': ['Poppins'],
            'mechanic': ['Rajdhani'],
        }
    },
    colors: {
      'gamefiDark': {
        DEFAULT: '#13141f',
        '300': '#555d78',
        '400': '#4a5169',
        '500': '#40465a',
        '600': '#34344A',
        '650': '#23252B',
        '700': '#24262F',
        '800': '#20232d',
        '900': '#13141f'
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
          '700': '#6CDB00',
          '800': '#288C09',
          '900': '#195806'
      },
      'gamefiYellow': {
          DEFAULT: '#FFB800',
          '50': '#FFEBB8',
          '100': '#FFE5A3',
          '200': '#FFDA7A',
          '300': '#FFCF52',
          '400': '#FFC329',
          '500': '#FFB800',
          '600': '#C79000',
          '700': '#8F6700',
          '800': '#573F00',
          '900': '#1F1600'
      },
      ...colors
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '960px',
      // => @media (min-width: 960px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
    require("@tailwindcss/aspect-ratio")
  ]
}