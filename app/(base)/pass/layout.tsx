import { Metadata } from "next"
import { FC, PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Unitap | Unitap Pass ❤️",
  description: "Unitap Pass is a VIP pass for Unitap.",
}

const PassLayout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>
}

export default PassLayout
