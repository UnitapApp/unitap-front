"use client"

import React, { useState } from "react"
import { useServerInsertedHTML } from "next/navigation"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"

const shouldForwardProp = (prop: string) =>
  !["mlAuto", "mrAuto", "textAlign"].includes(prop)

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== "undefined") return <>{children}</>

  return (
    <StyleSheetManager
      shouldForwardProp={shouldForwardProp}
      sheet={styledComponentsStyleSheet.instance}
    >
      {children}
    </StyleSheetManager>
  )
}
