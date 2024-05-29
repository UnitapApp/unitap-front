import { FC, PropsWithChildren } from "react"
import DevProviders from "./providers"

const DevLayout: FC<PropsWithChildren> = ({ children }) => {
  return <DevProviders>{children}</DevProviders>
}

export default DevLayout
