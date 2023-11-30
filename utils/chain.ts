import { Chain } from "@/types"

export const sortChainListByTotalClaimWeekly = (chainList: Chain[]) => {
  const sortedChainList = chainList.sort((a, b) => {
    if (a.totalClaimsThisRound < b.totalClaimsThisRound) {
      return 1
    }
    if (a.totalClaimsThisRound > b.totalClaimsThisRound) {
      return -1
    }

    return 0
  })
  return sortedChainList
}

export const getChainIcon = (chain: Chain) => {
  return chain.logoUrl
}

export const getChainClaimIcon = (chain: Chain) => {
  return chain.gasImageUrl
}

export function getTxUrl(chain: Chain, txHash: string) {
  let explorerUrl = chain.explorerUrl
  explorerUrl = explorerUrl.endsWith("/") ? explorerUrl : `${explorerUrl}/`
  return `${explorerUrl}tx/${txHash}`
}
