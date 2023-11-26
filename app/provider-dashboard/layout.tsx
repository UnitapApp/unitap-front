import ProviderDashboardLayout from "@/components/containers/provider-dashboard/layout"
import { Metadata } from "next"
import { FC, PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Unitap | Provider Dashboard 🖥️",
  description:
    "If you have account log in to have access to provider dashboard",
}

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <ProviderDashboardLayout>{children}</ProviderDashboardLayout>
}

export default Layout
