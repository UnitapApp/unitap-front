"use client";

import { UserProfileContext } from "@/context/userProfile";
import { Chain } from "@/types/gas-tap";
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
    [chainList]
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
            "after:bg-gastap-texture hover:bg-gray00 cursor-pointer h-full"
          }
          title={"Gas Tap"}
          buttonTitle={"Go to Tap"}
          buttonClass={
            "gradient-outline-button before:inset-[2px] text-gray100"
          }
        >
          <div className="relative">
            <div className={isGasTapAvailable ? "" : "blur-md"}>
              {sortedChainList.length > 0 && (
                <>
                  <p className={"font-semibold text-sm text-white mb-2.5 mt-6"}>
                    Weekly Ranking
                  </p>
                  <ul className={"text-white"}>
                    {sortedChainList.slice(0, 3).map((token, index) => (
                      <li
                        key={token.chainId}
                        className={
                          "flex text-xs bg-gray30 rounded-xl py-3 px-3 items-center justify-between mb-2"
                        }
                      >
                        <div className={"flex gap-2 items-center"}>
                          <p>#{index + 1}</p>
                          <span className="token-logo-container w-6 h-6 flex items-center justify-center">
                            <img
                              src={token.logoUrl}
                              width={24}
                              height={24}
                              alt={token.chainName}
                              className="token-logo w-auto h-[100%]"
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
          </div>
          {isGasTapAvailable || <NotAvailableTap />}
        </Widget>
      </Link>
    </>
  );
};

const NotAvailableTap: FC = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <h5 className="text-white p-3 text-center text-lg">
        Gas Tap is not available right now
      </h5>
    </div>
  );
};

export default GasTapLandingWidget;
