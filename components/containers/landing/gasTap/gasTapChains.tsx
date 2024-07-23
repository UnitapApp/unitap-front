"use client";

import { UserProfileContext } from "@/context/userProfile";
import { Chain } from "@/types/gastap";
import { sortChainListByTotalClaimWeekly } from "@/utils/chain";
import { FC, useContext, useMemo } from "react";
import Widget from "../widget";
import Link from "next/link";
import RoutePath from "@/utils/routes";

const GasTapLandingWidget: FC<{
  chainList: Chain[];
}> = ({ chainList }) => {
  const { isGasTapAvailable } = useContext(UserProfileContext);

  const sortedChainList = useMemo(
    () => sortChainListByTotalClaimWeekly(chainList),
    [chainList],
  );

  return (
    <>
      <Link
        className={`flex--1 ${isGasTapAvailable ? "" : "pointer-events-none"}`}
        href={RoutePath.FAUCET}
      >
        <Widget
          description={"Enjoy surfing Web3 without the worry of gas fees"}
          icon={"gastap-icon.svg"}
          id="gastap"
          iconSize={"w-7"}
          className={
            "relative z-20 h-full cursor-pointer after:bg-gastap-texture hover:bg-gray00"
          }
          title={"Gas Tap"}
          buttonTitle={"Go to Tap"}
          buttonClass={
            "gradient-outline-button before:inset-[2px] text-gray100"
          }
        >
          <div className="relative h-full">
            <div
              className={`${isGasTapAvailable ? "" : "blur-md"} flex h-full flex-col`}
            >
              {sortedChainList.length > 0 && (
                <>
                  <p className={"mb-2.5 mt-6 text-sm font-semibold text-white"}>
                    Weekly Ranking
                  </p>
                  <ul className={"mt-auto text-white"}>
                    {sortedChainList.slice(0, 3).map((token, index) => (
                      <li
                        key={token.chainId}
                        className={
                          "mb-2 flex items-center justify-between rounded-xl bg-gray30 px-3 py-3 text-xs"
                        }
                      >
                        <div className={"flex items-center gap-2"}>
                          <p>#{index + 1}</p>
                          <span className="token-logo-container flex h-6 w-6 items-center justify-center">
                            <img
                              src={token.logoUrl}
                              width={24}
                              height={24}
                              alt={token.chainName}
                              className="token-logo h-[100%] w-auto"
                            />
                          </span>
                          <p>{token.chainName}</p>
                        </div>
                        <p>
                          {token.totalClaimsThisRound} <span>claims</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {isGasTapAvailable || <NotAvailableTap />}
          </div>
        </Widget>
      </Link>
    </>
  );
};

const NotAvailableTap: FC = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <h5 className="p-3 text-center text-lg text-white">
        Gas Tap is not available right now
      </h5>
    </div>
  );
};

export default GasTapLandingWidget;
