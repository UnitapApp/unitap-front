import {
  FAST_INTERVAL,
  IntervalType,
  MEDIUM_INTERVAL,
  SLOW_INTERVAL,
} from "@/constants"
import { useEffect } from "react"

export const useFastRefresh = (
  callback: CallableFunction,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback()
    }, FAST_INTERVAL)

    return () => {
      clearInterval(timeout)
    }
  }, [dependencies])
}

export const useMediumRefresh = (
  callback: CallableFunction,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback()
    }, MEDIUM_INTERVAL)

    return () => {
      clearInterval(timeout)
    }
  }, dependencies)
}

export const useSlowRefresh = (
  callback: CallableFunction,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback()
    }, SLOW_INTERVAL)

    return () => {
      clearInterval(timeout)
    }
  }, dependencies)
}

export const useRefreshWithInitial = (
  callback: CallableFunction,
  interval: IntervalType,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback()
    }, interval)

    callback()

    return () => {
      clearInterval(timeout)
    }
  }, dependencies)
}
