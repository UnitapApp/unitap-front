"use client"
import dynamic from "next/dynamic"
import { FC, useEffect, useState } from "react"

// Define the type for dynamic component props
type DynamicComponentProps = { [key: string]: any } | null

// Function to get the dynamic component
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

interface ImporterProps {
  componentName: string
}

const Importer: FC<ImporterProps> = ({ componentName }) => {
  const [dynamicComponentProps, setDynamicComponentProps] =
    useState<DynamicComponentProps>(null)
  const DynamicComponent = getDynamicComponent(componentName)

  useEffect(() => {
    const fetchComponentProps = async () => {
      try {
        const component = await import(`@/components/${componentName}`)
        console.log(component)
        if (component.default?.propTypes) {
          setDynamicComponentProps(component.default.propTypes)
        } else if ((Object.values(component)?.[0] as any)?.propTypes) {
          setDynamicComponentProps(
            (Object.values(component)?.[0] as any).propTypes,
          )
        } else if (component.propTypes) {
          setDynamicComponentProps(component.propTypes)
        } else {
          setDynamicComponentProps(null)
        }
      } catch (error) {
        console.error("Error fetching component props:", error)
        setDynamicComponentProps(null)
      }
    }

    fetchComponentProps()
  }, [componentName])

  return (
    <>
      {dynamicComponentProps && (
        <pre>{JSON.stringify(dynamicComponentProps, null, 2)}</pre>
      )}
      <DynamicComponent />
    </>
  )
}

export default Importer
