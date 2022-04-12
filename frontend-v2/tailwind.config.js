// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx,ts,tsx,vue}',
    './components/**/*.{js,jsx,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      fontFamily: {
        casual: ['Poppins'],
        mechanic: ['Rajdhani']
      },
      borderRadius: {
        DEFAULT: '0.2rem'
      },
      lineHeight: {
        shi: '1.1'
      },
      gridTemplateColumns: {
        '4-auto': 'repeat(4, auto)',
        '3-auto': 'repeat(3, auto)',
        '2-auto': 'repeat(2, auto)'
      }
    },
    colors: {
      gamefiDark: {
        DEFAULT: '#13141f',
        50: '#9AA1B7',
        100: '#babac2',
        200: '#92929e',
        300: '#777786',
        400: '#5f5f6b',
        500: '#474750',
        600: '#393940',
        630: '#3E4150',
        650: '#23252B',
        700: '#28282E',
        800: '#191C25',
        900: '#13141f'
      },
      gamefiGreen: {
        DEFAULT: '#72F34B',
        50: '#F9FEF7',
        100: '#EAFDE4',
        200: '#CCFBBE',
        300: '#AEF898',
        400: '#90F671',
        500: '#72F34B',
        600: '#49EF16',
        700: '#6CDB00',
        800: '#288C09',
        900: '#195806'
      },
      gamefiYellow: {
        DEFAULT: '#FFB800',
        50: '#FFEBB8',
        100: '#FFE5A3',
        200: '#FFDA7A',
        300: '#FFCF52',
        400: '#FFC329',
        500: '#FFB800',
        600: '#C79000',
        700: '#8F6700',
        800: '#573F00',
        900: '#1F1600'
      },
      gamefiRed: {
        DEFAULT: '#DE4343'
      },
      ...colors
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '960px',
      // => @media (min-width: 960px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px'
      // => @media (min-width: 1536px) { ... }
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.35rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
      '13px': ['13px', { lineHeight: '18px' }],
      '10px': ['10px', { lineHeight: '14px' }]
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
}
