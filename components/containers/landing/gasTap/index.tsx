import GasTapLandingWidget from "./gasTapChains"
import { FC } from "react"
import { Chain } from "@/types"

const GasTapLanding: FC<{ chains: Chain[] }> = async ({ chains }) => {
  return <GasTapLandingWidget chainList={chains} />
}

export default GasTapLanding
