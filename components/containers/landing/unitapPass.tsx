"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import {
  useReadUnitapPassBatchSaleBatchSoldCount,
  useReadUnitapPassBatchSaleBatchSize,
} from "@/types/abis/contracts";
import RoutePath from "@/utils/routes";
import Link from "next/link";

const deadline = new Date("January 12, 2023 16:00:00 UTC");

const UnitapPass = () => {
  const maxBatches = useReadUnitapPassBatchSaleBatchSize({
    chainId: 1,
  });

  const batchSold = useReadUnitapPassBatchSaleBatchSoldCount({
    chainId: 1,
  });

  const maxBatchAmount = maxBatches.data;

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
          <h3 className={"text-2xl font-bold text-white"}>
            Mint Unitap Pass NFT
          </h3>
          <Icon
            alt="unitap pass"
            iconSrc="/assets/images/landing/unitap-pass.svg"
            className="ml-4"
          />
        </div>
        {maxBatches.isSuccess ? (
          <p className={"text-gray100"}>
            {deadline < new Date() && (
              <>
                <span className={"text-white"}>
                  {(maxBatchAmount! - batchSoldAmount!).toString()}
                </span>{" "}
                of <span className={"text-white"}>{maxBatchAmount}</span> Passes
                are left in the current batch. Mint your Passes now
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
            alt="arrow right"
            className="ml-5"
            iconSrc="/assets/images/landing/arrow-right.svg"
          />
        </ClaimButton>
      </div>
    </Link>
  );
};

export default UnitapPass;
