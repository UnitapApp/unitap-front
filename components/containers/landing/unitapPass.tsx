"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { getSupportedChainId } from "@/constants";
import {
  useReadUnitapPassBatchSaleBatchSoldCount,
  useReadUnitapPassBatchSaleBatchSize,
} from "@/types/abis/contracts";
import RoutePath from "@/utils/routes";
import Link from "next/link";

const deadline = new Date("January 12, 2023 16:00:00 UTC");

const UnitapPass = () => {
  const maxBatches = useReadUnitapPassBatchSaleBatchSize({
    chainId: getSupportedChainId(),
  });

  const batchSold = useReadUnitapPassBatchSaleBatchSoldCount({
    chainId: getSupportedChainId(),
  });

  // const maxBatchAmount = maxBatches.data;
  const maxBatchAmount = 500;

  const beforeMinted = 312;

  const batchSoldAmount = batchSold.data;

  return (
    <Link
      href={RoutePath.NFT}
      id="home-nft"
      className={
        "uni-card flex-col items-center gap-4 px-12 py-3 text-center sm:text-left md:flex-row md:gap-0 " +
        "flex justify-between after:inset-auto after:-top-10 after:left-0 after:h-32 after:w-36 " +
        "cursor-pointer text-white after:rounded-2xl after:bg-nft-texture hover:bg-gray00 hover:after:top-2"
      }
    >
      <div
        className={"card-text flex flex-col items-start justify-center gap-4"}
      >
        <div className="flex items-center">
          <h3 className={"text-xl font-bold text-white"}>
            Mint Unitap Pass to unlock exclusive features and
            <span className="mx-1 bg-g-primary bg-clip-text text-transparent">
              future rewards
            </span>
            😉
          </h3>
        </div>
        {maxBatches.isSuccess ? (
          <p className={"text-gray100"}>
            {deadline < new Date() && (
              <>
                <span className={"text-white"}>
                  {(
                    maxBatchAmount! -
                    (batchSoldAmount! + beforeMinted)
                  ).toString()}
                </span>{" "}
                of <span className={"text-white"}>{maxBatchAmount}</span> Passes
                are left in the current batch.
              </>
            )}
          </p>
        ) : (
          <div className="h-6 w-full"></div>
        )}
      </div>
      <div>
        <ClaimButton className="!w-32 before:!inset-[1px]">
          <p>Mint</p>
          <Icon
            className="ml-5"
            iconSrc="/assets/images/landing/arrow-right.svg"
          />
        </ClaimButton>
      </div>
    </Link>
  );
};

export default UnitapPass;
