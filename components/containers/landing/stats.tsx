import { countGasClaimedAPI, countUsersAPI } from "@/utils/api";
import Widget from "./widget";
import { FC } from "react";
import { Chain } from "@/types";
import { numberWithCommas } from "@/utils";

export const getTotalNetworks = (chains: Chain[]) => {
  return chains.reduce((total, chain) => total + (!chain.isTestnet ? 1 : 0), 0);
};

export const getTotalTestNetworks = (chains: Chain[]) => {
  return chains.reduce((total, chain) => total + (chain.isTestnet ? 1 : 0), 0);
};

const LandingStats: FC<{ chains: Chain[] }> = async ({ chains }) => {
  const usersCount = await countUsersAPI();
  const gasClaimedCount = await countGasClaimedAPI();

  const stats = [
    { name: "Main Networks", number: getTotalNetworks(chains) },
    { name: "Test Networks", number: getTotalTestNetworks(chains) },
  ];

  return (
    <section id="home-stats" className={"flex justify-between gap-4"}>
      <Widget
        className={
          "flex-1 px-20 !pb-7 !pt-5 after:inset-auto after:left-0 after:top-0 after:h-28 after:w-36 after:bg-stats-texture"
        }
        title={"Unitap Stats"}
        titleClass={"!justify-center"}
      >
        <div
          className={
            "mt-4 flex flex-col justify-evenly gap-4 md:flex-row md:gap-0"
          }
        >
          <div className="flex flex-col items-center gap-2">
            <p className={"text-xl font-semibold text-space-green"}>
              {numberWithCommas(usersCount)}
            </p>
            <p className={"text-gradient-primary text-xs font-medium"}>
              {" "}
              Unitap Users
            </p>
          </div>
          {stats.map((stat) => (
            <div key={stat.name} className={"flex flex-col items-center gap-2"}>
              <p className={"text-xl font-semibold text-space-green"}>
                {/* {numberWithCommas(typeof stat.number == 'string' ? parseFloat(stat.number) : stat.number)} */}
                {numberWithCommas(stat.number)}
              </p>
              <p className={"text-gradient-primary text-xs font-medium"}>
                {stat.name}
              </p>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <p className={"text-xl font-semibold text-space-green"}>
              {numberWithCommas(gasClaimedCount)}
            </p>
            <p className={"text-gradient-primary text-xs font-medium"}>
              {" "}
              Gas Fees Claimed
            </p>
          </div>
        </div>
      </Widget>
    </section>
  );
};

export default LandingStats;
