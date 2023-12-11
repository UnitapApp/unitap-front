interface designVariable {
  sizes: {
    basePadding: number;
    baseMargin: number;
    baseRadius: number;
  };
  colors: {
    [key: string]: any;
    primary: string;
    secondary: string;
    bright: string;
    black: string;
    black1: string;
    black2: string;
    black3: string;
    black4: string;
    black5: string;
    border_black: string;
    dark: string;
    dark1: string;
    gray: string;
    gray00: string;
    gray10: string;
    gray20: string;
    gray70: string;
    gray80: string;
    gray90: string;
    gray100: string;
    placeholderGray: string;
    second_gray_light: string;
    transparent_black: string;
    green: string;
    space_green: string;
    darkgreen: string;
    placeholderGreen: string;
    warningRed: string;
    DarkWarningRed: string;
    warningPink: string;
  };
  bgGradient: {
    primary: string;
    primary_2: string;
    primaryDisabled: string;

    dark: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    smallDesktop: string;
    desktop: string;
  };
}

export const DV: designVariable = {
  sizes: {
    basePadding: 8,
    baseMargin: 8,
    baseRadius: 8,
  },
  colors: {
    primary: "#59D1F8",
    secondary: "#D683DC",
    bright: "#FB8A61",
    black: "#18181F",
    black1: "#1E1E29",
    black2: "#21212C",
    black3: "#1a1a24",
    black4: "#15151B",
    black5: "#1b1b26",
    border_black: "#13131e",
    dark: "#11111C",
    dark1: "#030317",
    gray: "#4C4C64",
    gray00: "#0C0C17",
    gray10: "#11111C",
    gray20: "#13131E",
    gray70: "#30303A",
    gray80: "#4C4C5C",
    gray90: "#67677B",
    gray100: "#B5B5C6",
    placeholderGray: "#979797",
    second_gray_light: "#67677B",
    transparent_black: "#11111c99",
    space_green: "#4CE6A1",
    green: "#4BF1A2",
    darkgreen: "#274641",
    placeholderGreen: "#5D817B",
    warningRed: "#EA5365",
    DarkWarningRed: "#452635",
    warningPink: "#FF909E",
  },
  bgGradient: {
    primary:
      "linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 56.06%, #E1C4F4 73.07%, #DD40CD 111.44%);",
    primary_2:
      "linear-gradient(91.35deg,#4BF2A2 35.66%,#A89FE7 50.06%,#E1C4F4 7.07%,#DD40CD 70.44%)",
    primaryDisabled:
      "radial-gradient(124.04% 1117.67% at 17.05% 37.02%, #98bdab 0%, #726d8e 42.19%, #c498bf 100%)",
    dark: "radial-gradient(174.04% 3217.67% at 17.05% 37.02%, #2A3837 0%, #3F2B44 42.19%, #322837 100%)",
  },
  breakpoints: {
    mobile: "600px", // xs
    tablet: "992px", // sm
    smallDesktop: "1224px", // md
    desktop: "1440px", // lg
    // bigger than 1440px -> // xlg
  },
};
