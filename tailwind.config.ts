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
        "68": "17rem",
        "88": "22rem",
        "100": "25rem",
        "104": "26rem",
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      colors: {
        "landing-primary": "#FCB2FF",
        "landing-secondary": "#FDFFC4",
        "landing-tertiary": "#EBEAFF",
        "landing-raffle": "#FFC4C4",
        "landing-token": "#CCFFC4",
        "gray-full": "#F8F8F8",
        "raffle-card": "#F7FFEF",
        "black-0": "#000",
        "gray-secondary": "#D9D9D926",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        input: "hsl(var(--input))",
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        "brand-primary": "#72FFC6",
        "primary-dashboard": "#867FEE",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      boxShadow: {
        "primary-button":
          "4px 6px 0px 0px #000000, 0px 2px 0px 0px #FFFFFF inset",
        "primary-button-sm": "2px 3px 0px 0px #000000",
        "card-image": "4px 6px 0px 0px #000000",
      },
      borderWidth: {
        "3": "3px",
      },
      backgroundImage: {
        primaryGradient:
          "linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 39.49%, #E1C3F4 73.07%, #DD40CD 111.44%)",
        primaryGradient2:
          "linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 39.49%, #E1C3F4 43.07%, #DD40CD 100.44%)",
        primaryGradient3:
          "linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 89.49%, #E1C3F4 156.07%, #DD40CD 100.44%)",
        "primaryGradient-2":
          "linear-gradient(91.35deg, #4BF2A2 -150.66%, #A89FE7 39.49%, #E1C3F4 150.07%)",
        "g-twitter":
          "linear-gradient(91.35deg, #03A9F4 -0%, #DFFFF5 42.19%, #03E6F4 100%)",
        "g-primary":
          "linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 56.06%, #E1C4F4 73.07%, #DD40CD 111.44%)",
        "unitap-galaxy": "linear-gradient(to right, #1F3A3E, #412E4894)",
        "g-dark-primary-gradient":
          "linear-gradient(to right, #2A3837,#3F2B44, #322837)",
        "g-primary-2":
          "linear-gradient(91.35deg,#4BF2A2 35.66%,#A89FE7 50.06%,#E1C4F4 7.07%,#DD40CD 70.44%)",
        "g-primary-low":
          "linear-gradient(91.35deg, rgba(75, 242, 162, 0.16) -4.66%, rgba(168, 159, 231, 0.35) 39.49%, rgba(225, 196, 244, 0.31) 73.07%, rgba(221, 64, 205, 0.31) 111.44%)",
        "br-pre-enrollment":
          "linear-gradient(274.27deg, #383857 9.67%, rgba(167, 159, 229, 0.5) 96.26%);",
      },
      dropShadow: {
        "primary-xl": "0px 8px 18px rgba(81, 88, 246, 0.15)",
      },
      zIndex: {
        "100": "100",
      },
      keyframes: {
        wiggle: {
          "0%": {
            transform: "rotate(-8deg)",
          },
          "50%": {
            transform: "rotate(8deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
        flip: {
          "0%, 50%": {
            transform: "scaleX(-1)",
          },
          "25%, 75%": {
            transform: "scaleX(1)",
          },
        },
        rocket: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-15px)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeToggle: {
          "0%": {
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "95%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        blinking: {
          "50%": {
            opacity: ".3",
          },
        },
        fadeInOut: {
          "0%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        changeColor: {
          "0%": {
            backgroundColor: "red",
          },
          "50%": {
            backgroundColor: "yellow",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out, wiggle 1s ease-in-out",
        flip: "flip 0.5s ease-in ",
        rocket: "rocket 1500ms infinite  alternate;",
        fadeIn: "fadeIn 0.8s ease-in-out",
        blinking: "blinking 2s step-start 0s infinite",
        fadeInOut: "fadeInOut 2s ease-in-out infinite",
        fadeToggle: "fadeToggle 5s ease-in-out infinite",
        changeColor: "changeColor 1s ease-in",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionDuration: {
        "0": "0ms",
        "250": "250ms",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
