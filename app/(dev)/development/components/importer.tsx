"use client"
import dynamic from "next/dynamic"
import { FC, useEffect, useState } from "react"

const getDynamicComponent = (c: string) =>
  dynamic(
    () =>
      import(`@/components/${c}`).then((res) => {
        if (res.default) return res.default

        if (Object.values(res)?.[0]) return Object.values(res)[0]

        if (res) return res
      }),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    },
  )

const Importer: FC<{
  componentName: string
}> = ({ componentName }) => {
  const DynamicComponent = getDynamicComponent(componentName)

  return <DynamicComponent />
}

export default Importer
