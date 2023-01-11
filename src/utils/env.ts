const NODE_ENV = process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV

export function isDevelopmentEnv(): boolean {
    return NODE_ENV === 'development'
}

export function isTestEnv(): boolean {
    return NODE_ENV === 'test'
}

export function isStagingEnv(): boolean {
    return Boolean(process.env.REACT_APP_STAGING)
}

export function isProductionEnv(): boolean {
    return NODE_ENV === 'production' && !isStagingEnv()
}
