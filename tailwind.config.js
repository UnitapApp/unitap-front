/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'xl1440': '1440px'
      },
      width: {
        68: '17rem',
        100: '25rem',
        104: '26rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      colors: {
        primary: '#EF476F',
        secondary: '#F59569',
        input: '#EFF3F8',
        label: '#565656',
        black: '#353535',
        body: '#21212C',
        chips: '#5EBAB0',
        gray: '#BFBFBF',
        yellowC: '#FFD166',
        'space-green': '#4CE6A1',
        'light-space-green': '#D5EBE1',
        'light-gray': '#EBECEF',
        'light-gray-2': '#EDF2F3',
        'dark-gray': '#757575',
        'dark-grey-2': '#13131E',
        'dark-gray-3': '#0C0C17',
        'dark-gray-4': '#1B1B26',
        'dark-gray-5': '#21212C',
        'dark-gray-6': '#1e1e29',
        'gray-100': '#B5B5C6',
        'blue-gray-light': '#E9EFF6',
        'primary-light': '#FFE9EE',
        'primary-light-2': '#F8F0F4',
        'secondary-light': '#FFECE4',
        'secondary-light-2': '#F6C7B4',
        'disabled-bg': '#C0C0C0',
        'disabled-text': '#939393',
      },

      borderWidth: {
        3: '3px',
      },
      backgroundImage: {
        'home-header-texture': "url('../public/assets/images/landing/home-header-texture.png')",
        'gastap-texture': "url('../public/assets/images/landing/gastap-texture.png')",
        'tokentap-texture': "url('../public/assets/images/landing/tokentap-texture.png')",
        'nft-texture': "url('../public/assets/images/landing/genesis-nft.png')",
        'donate-texture': "url('../public/assets/images/landing/donate-texture.png')",
        'stats-texture': "url('../public/assets/images/landing/stats-texture.png')",
        'g-primary': 'linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 56.06%, #E1C4F4 73.07%, #DD40CD 111.44%)',
        // 'tokens-left': "url('/img/tokenLeft-background.svg')",
        // gradient: 'linear-gradient(135deg,#5158f6,#822df5 33.76%,#f3a761)',
        // g1: 'linear-gradient(90.54deg, rgba(239, 71, 111, 0.15) -2.28%, rgba(146, 84, 153, 0.15) 102.51%);',
        // 'presale-header': "url('/img/presale-header.svg')",
        // 'public-sale-header': "url('/img/public-header.svg')",
        // squircle: "url('../public/squircle.png')",
        // 'gradient-light': "radial-gradient(62.15% 4494.21% at 43.37% 31.6%, rgba(239, 71, 111, 0.1) 0%, rgba(94, 87, 145, 0.1) 100%)",
        // blob: "url('/img/blob-bg.svg')",
        // blur: "url('/img/blur-bg.svg')",
      },
      dropShadow: {
        'primary-xl': '0px 8px 18px rgba(81, 88, 246, 0.15)',
      },
      zIndex: {
        100: '100',
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        flip: {
          '0%, 50%': { transform: 'scaleX(-1)' },
          '25%, 75%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out, wiggle 1s ease-in-out',
        flip: 'flip 0.5s ease-in ',
      },
    },
  },
  // plugins: [require('@tailwindcss/forms'),require('@tailwindcss/aspect-ratio'),],
};
