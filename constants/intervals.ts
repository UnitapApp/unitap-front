const isCypress = process.env.REACT_APP_IS_CYPRESS === "true";
export const CYPRESS_FAST_INTERVAL = 1000;
export const CYPRESS_MEDIUM_INTERVAL = 1500;
export const CYPRESS_SLOW_INTERVAL = 2000;
export const FAST_INTERVAL = isCypress ? CYPRESS_FAST_INTERVAL : 60 * 3 * 1000;
export const MEDIUM_INTERVAL = isCypress
  ? CYPRESS_MEDIUM_INTERVAL
  : 60 * 5 * 1000;
export const SLOW_INTERVAL = isCypress ? CYPRESS_SLOW_INTERVAL : 60 * 8 * 1000;
export const BASE_REFRESH_INTERVAL = 60 * 5 * 1000;

export enum IntervalType {
  FAST = FAST_INTERVAL,
  SLOW = SLOW_INTERVAL,
  MEDIUM = MEDIUM_INTERVAL,
  BASE_REFRESH = BASE_REFRESH_INTERVAL,
}
