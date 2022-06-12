const isCypress = process.env.REACT_APP_IS_CYPRESS === 'true';
export const CYPRESS_FAST_INTERVAL = 200;
export const CYPRESS_MEDIUM_INTERVAL = 500;
export const CYPRESS_SLOW_INTERVAL = 1000;
export const FAST_INTERVAL = isCypress ? CYPRESS_FAST_INTERVAL : 5000;
export const MEDIUM_INTERVAL = isCypress ? CYPRESS_MEDIUM_INTERVAL : 10000;
export const SLOW_INTERVAL = isCypress ? CYPRESS_SLOW_INTERVAL : 20000;
