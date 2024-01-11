import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        "digital-numbers": ["DigitalNumbers", "serif"],
      },
      screens: {
        xl1440: "1440px",
      },
      width: {
        68: "17rem",
        88: "22rem",
        100: "25rem",
        104: "26rem",
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      colors: {
        primary: "#EF476F",
        secondary: "#F59569",
        input: "#EFF3F8",
        label: "#565656",
        black: "#353535",
        body: "#21212C",
        chips: "#5EBAB0",
        gray: "#4C4C64",
        gray00: "#0C0C17",
        gray10: "#10101B",
        gray20: "#161623",
        gray30: "#1B1B29",
        gray40: "#1E1E2C",
        gray50: "#212130",
        gray60: "#242431",
        gray70: "#303043",
        gray80: "#4C4C5C",
        gray90: "#67677B",
        gray100: "#B5B5C6",
        orange: "#F5841F",
        error: "#EA5365",
        code: "#292938",
        cyan: "#165369",
        purple: "#362469",
        twitter: "#B5FAF5",
        "dark-purple": "#39275E",
        "light-gray": "#EBECEF",
        "light-gray-2": "#EDF2F3",
        "dark-gray": "#757575",
        "space-green": "#4CE6A1",
        "light-space-green": "#D5EBE1",
        "dark-grey-2": "#13131E",
        "blue-gray-light": "#E9EFF6",
        "primary-light": "#FFE9EE",
        "primary-light-2": "#F8F0F4",
        "secondary-light": "#FFECE4",
        "secondary-light-2": "#F6C7B4",
        "dark-space-green": "#274641",
        "disabled-bg": "#C0C0C0",
        "disabled-text": "#939393",
        "secondary-text": "#997EA4",
        warn: "#F16E35",
        warning2: "#877A74",
      },

      borderWidth: {
        3: "3px",
      },
      backgroundImage: {
        primaryGradient:
          "linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 39.49%, #E1C3F4 73.07%, #DD40CD 111.44%)",
        "home-header-texture":
          "url('/assets/images/landing/main-bg-profile.svg')",
        "what-is-unitap-header":
          "url('/assets/images/about/what-is-unitap-header.png')",
        "gastap-texture": "url('/assets/images/landing/gastap-texture.png')",
        "tokentap-texture":
          "url('/assets/images/landing/tokentap-texture.png')",
        "prizetap-texture":
          "url('/assets/images/landing/prizetap-texture.png')",
        "prizetap-raffle-texture":
          "url('/assets/images/prize-tap/raffle-win.svg')",
        "learntap-texture": "url('/assets/images/landing/learn-tap-bg.svg')",
        "launchtap-texture":
          "url('/assets/images/landing/launchtap-texture.png')",
        "staketap-texture":
          "url('/assets/images/landing/staketap-texture.png')",
        "what-is-unitap": "url('/assets/images/landing/what-is-unitap.png')",
        "nft-texture": "url('/assets/images/landing/genesis-nft.png')",
        "donate-texture": "url('/assets/images/landing/donate-texture.png')",
        "donate-texture-s": "url('/assets/images/donate/donate-texture.svg')",
        "donate-texture-p": "url('/assets/images/donate/donate-texture.png')",
        "stats-texture": "url('/assets/images/landing/stats-texture.png')",
        "soft-primary":
          "linear-gradient(90deg, #1F3A3E 0%, rgba(28, 32, 44, 0.50) 33.85%, rgba(27, 27, 41, 0.50) 63.02%, rgba(77, 52, 81, 0.60) 100%)",
        "g-twitter":
          "linear-gradient(91.35deg, #03A9F4 -0%, #DFFFF5 42.19%, #03E6F4 100%)",
        "g-primary":
          "linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 56.06%, #E1C4F4 73.07%, #DD40CD 111.44%)",
        "g-primary-2":
          "linear-gradient(91.35deg,#4BF2A2 35.66%,#A89FE7 50.06%,#E1C4F4 7.07%,#DD40CD 70.44%)",
        "g-primary-low":
          "linear-gradient(91.35deg, rgba(75, 242, 162, 0.16) -4.66%, rgba(168, 159, 231, 0.35) 39.49%, rgba(225, 196, 244, 0.31) 73.07%, rgba(221, 64, 205, 0.31) 111.44%)",
      },
      dropShadow: {
        "primary-xl": "0px 8px 18px rgba(81, 88, 246, 0.15)",
      },
      zIndex: {
        100: "100",
      },
      keyframes: {
        wiggle: {
          "0%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(8deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        flip: {
          "0%, 50%": { transform: "scaleX(-1)" },
          "25%, 75%": { transform: "scaleX(1)" },
        },
        rocket: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-15px)" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
				blinking: {
					'50%': { opacity: '.3'},
				},
        fadeInOut: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out, wiggle 1s ease-in-out",
        flip: "flip 0.5s ease-in ",
        rocket: "rocket 1500ms infinite  alternate;",
        fadeIn: 'fadeIn 0.8s ease-in-out',
				blinking: 'blinking 2s step-start 0s infinite',
        fadeInOut: 'fadeInOut 2s ease-in-out infinite',
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionDuration: {
        0: "0ms",
        250: "250ms",
      },
    },
  },
};
export default config;
