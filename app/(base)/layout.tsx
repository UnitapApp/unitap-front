import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { FC, PropsWithChildren } from "react"

import AxiosApiManager from "@/components/axios-api-manager"
import UnitapProvider from "@/context"
import {
  ConnectBrightIdModal,
  BrightConnectionModal,
  CreateBrightIdAccountModal,
} from "@/components/containers/modals"
import StyledJsxRegistry from "@/components/styled-components"
import { ConnectWalletModal } from "@/components/containers/modals/ConnectWalletModal"

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <UnitapProvider>
        <StyledJsxRegistry>
          <div id="app">
            <Header />
            <main className="m-auto flex min-h-[calc(100vh_-_130px)] w-full max-w-screen-2xl flex-col px-4 py-14 sm:px-6 lg:px-8 xl:px-40 xl1440:px-60">
              {children}
            </main>

            <Footer />
          </div>
          <ConnectBrightIdModal />
          <BrightConnectionModal />
          <CreateBrightIdAccountModal />
          <ConnectWalletModal />
        </StyledJsxRegistry>
        <AxiosApiManager />
      </UnitapProvider>
    </>
  )
}

export default BaseLayout
