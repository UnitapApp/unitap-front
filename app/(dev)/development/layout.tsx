import { FC, PropsWithChildren } from "react"
import DevProviders from "./providers"
import { redirect } from "next/navigation"
import { isStage } from "@/utils/environment"
import DevHeader from "./_components/header"

const DevLayout: FC<PropsWithChildren> = ({ children }) => {
  if (!isStage()) redirect("/")

  return (
    <DevProviders>
      <DevHeader />
      {children}
    </DevProviders>
  )
}

export default DevLayout
