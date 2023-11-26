"use client"

import { ClaimButton } from "@/components/ui/Button/button"
import Icon from "@/components/ui/Icon"
import {
  useUnitapPassBatchSaleBatchSize,
  useUnitapPassBatchSaleBatchSoldCount,
} from "@/types/abis/contracts"
import RoutePath from "@/utils/routes"
import Link from "next/link"

const deadline = new Date("January 12, 2023 16:00:00 UTC")

const UnitapPass = () => {
  const maxBatches = useUnitapPassBatchSaleBatchSize({
    chainId: 1,
  })

  const batchSold = useUnitapPassBatchSaleBatchSoldCount({
    chainId: 1,
  })

  return (
    <Link
      href={RoutePath.NFT}
      id="home-nft"
      className={
        "items-center px-12 text-center sm:text-left md:flex-row flex-col gap-4 md:gap-0 uni-card py-3 " +
        "after:inset-auto after:left-0 after:-top-10 after:w-36 after:h-32 flex justify-between " +
        "after:rounded-2xl after:bg-nft-texture text-white hover:bg-gray00 cursor-pointer hover:after:top-2"
      }
    >
      <div
        className={"flex gap-4 flex-col items-start card-text justify-center"}
      >
        <div className="flex items-center">
          <h3 className={"font-bold text-2xl text-white"}>
            Mint Unitap Pass NFT
          </h3>
          <Icon
            iconSrc="/assets/images/landing/unitap-pass.svg"
            className="ml-4"
          />
        </div>
        {maxBatches.isSuccess ? (
          <p className={"text-gray100"}>
            {deadline < new Date() && (
              <>
                <span className={"text-white"}>
                  {maxBatches.data! - batchSold.data!}
                </span>{" "}
                of <span className={"text-white"}>{maxBatches.data}</span>{" "}
                Passes are left in the current batch. Mint your Passes now
              </>
            )}
          </p>
        ) : (
          <div className="h-6 w-full"></div>
        )}
      </div>
      <div>
        <ClaimButton className="before:!inset-[1px]">
          <p>Go to Mint Page</p>
          <Icon
            className="ml-5"
            iconSrc="/assets/images/landing/arrow-right.svg"
          />
        </ClaimButton>
      </div>
    </Link>
  )
}

export default UnitapPass
