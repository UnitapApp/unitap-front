import { FC } from "react";



export type ClaimButtonProps = {
  needsFunding: boolean
  amount: string | number
  symbol: string
  isClaiming: boolean
}


const ClaimButton: FC<ClaimButtonProps> = () => {
  return (
    <button>
      Claim
    </button>
  )
}