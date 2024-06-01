"use client"

import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

export type DebugMenuToolbarType = {
  liningMethod: "px" | "rem" | "cm" | "em"
  liningMargin: number
  liningEnabled: boolean
  rendererSize: "mobile" | "tablet" | "desktop"
  startBlockX: number
  startBlockY: number
  canvasWidth: number
  canvasHeight: number
}

export const ComponentsContext = createContext({
  debugMenuToolbar: {
    liningMethod: "px" as "px" | "rem" | "cm" | "em",
    liningMargin: 20,
    liningEnabled: true,
    rendererSize: "mobile" as "mobile" | "tablet" | "desktop",
    startBlockX: 0,
    startBlockY: 0,
    canvasWidth: 100,
    canvasHeight: 100,
  },
  setDebugMenuToolbar: ((value: DebugMenuToolbarType) => {}) as Dispatch<
    SetStateAction<DebugMenuToolbarType>
  >,
})

export const useComponentsContext = () => useContext(ComponentsContext)

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const [debugMenuToolbar, setDebugMenuToolbar] = useState({
    liningMethod: "px" as "px" | "rem" | "cm" | "em",
    liningMargin: 20,
    liningEnabled: true,
    rendererSize: "mobile" as "mobile" | "tablet" | "desktop",
    startBlockX: 0,
    startBlockY: 0,
    canvasWidth: 100,
    canvasHeight: 100,
  })

  useEffect(() => {
    setDebugMenuToolbar((debugMenuToolbar) => ({
      ...debugMenuToolbar,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
    }))
  }, [])

  return (
    <ComponentsContext.Provider
      value={{
        debugMenuToolbar,
        setDebugMenuToolbar,
      }}
    >
      {children}
    </ComponentsContext.Provider>
  )
}

export default Providers
