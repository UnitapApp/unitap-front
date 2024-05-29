"use client"

import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react"

export type DebugMenuToolbarType = {
  liningMethod: "px" | "rem" | "cm" | "em"
  liningMargin: number
  liningEnabled: boolean
  rendererSize: "mobile" | "tablet" | "desktop"
}

export const ComponentsContext = createContext({
  debugMenuToolbar: {
    liningMethod: "px" as "px" | "rem" | "cm" | "em",
    liningMargin: 20,
    liningEnabled: true,
    rendererSize: "mobile" as "mobile" | "tablet" | "desktop",
  },
  setDebugMenuToolbar: (value: DebugMenuToolbarType) => {},
})

export const useComponentsContext = () => useContext(ComponentsContext)

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const [debugMenuToolbar, setDebugMenuToolbar] = useState({
    liningMethod: "px" as "px" | "rem" | "cm" | "em",
    liningMargin: 20,
    liningEnabled: true,
    rendererSize: "mobile" as "mobile" | "tablet" | "desktop",
  })

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
