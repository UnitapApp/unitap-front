
interface designVariable {
    sizes: {
        basePadding: number,
        baseMargin: number,
        baseRadius: number,
    },
    colors: {
        [key: string]: any,
        primary: string,
        secondary: string,
        bright: string,
        black: string,
        black1: string,
        dark: string,
        dark1: string,
        gray: string,
        transparent_black: string,
        green: string,
        darkgreen: string,
        warningRed: string,
    },
    bgGradient: {
        primary: string,
        dark: string
    }
}

export const DV: designVariable = {
    sizes: {
        basePadding: 8,
        baseMargin: 8,
        baseRadius: 8,
    },
    colors: {
        primary: '#59D1F8',
        secondary: '#D683DC',
        bright: '#FB8A61',
        black: '#18181F',
        black1: '#1E1E29',
        dark: '#11111C',
        dark1: '#030317',
        gray: '#4C4C64',
        transparent_black: '#11111c99',
        green: '#4BF1A2',
        darkgreen: '#274641',
        warningRed: '#EA5365',
    },
    bgGradient: {
        primary: 'radial-gradient(124.04% 1117.67% at 17.05% 37.02%, #4BF2A2 0%, #564D8F 42.19%, #DD40CD 100%)',
        dark: 'radial-gradient(174.04% 3217.67% at 17.05% 37.02%, #2A3837 0%, #3F2B44 42.19%, #322837 100%)',
    }
}

