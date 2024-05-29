"use client"

import { FC, PropsWithChildren } from "react"
import { useComponentsContext } from "./providers"

const LineRenderer: FC<PropsWithChildren> = ({ children }) => {
  const { debugMenuToolbar } = useComponentsContext()

  return (
    <div
      className="w-full h-screen"
      // key={debugMenuToolbar.liningEnabled}
      style={{
        backgroundImage: debugMenuToolbar.liningEnabled
          ? `linear-gradient(90deg, hsla(0,0%,72%,.5) 1px, transparent 1px), linear-gradient(hsla(0,0%,72%,.5) 1px, transparent 1px)`
          : "none",
        backgroundRepeat: "repeat",
        backgroundSize: `${debugMenuToolbar.liningMargin}${debugMenuToolbar.liningMethod} ${debugMenuToolbar.liningMargin}${debugMenuToolbar.liningMethod}`,
      }}
    >
      {children}
    </div>
  )
}

export default LineRenderer
