import TokenTapProvider from "@/context/tokenTapProvider"
import { getTokensListAPI } from "@/utils/api"
import { FC, PropsWithChildren } from "react"

const TokenTapLayout: FC<PropsWithChildren> = async ({ children }) => {
  const tokens = await getTokensListAPI()

  return <TokenTapProvider tokens={tokens}>{children}</TokenTapProvider>
}

export default TokenTapLayout
