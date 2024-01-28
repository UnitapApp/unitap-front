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
    <section id="home-stats" className={"flex gap-4 justify-between"}>
      <Widget
        className={
          "flex-1 !pb-7 !pt-5 px-20 after:bg-stats-texture after:inset-auto after:left-0 after:top-0 after:w-36 after:h-28"
        }
        title={"Unitap Stats"}
        titleClass={"!justify-center"}
      >
        <div
          className={
            "flex justify-between mt-4 md:flex-row flex-col gap-4 md:gap-0"
          }
        >
          <div className="flex flex-col gap-2 items-center">
            <p className={"text-xl text-space-green font-semibold"}>
              {usersCount}
            </p>
            <p className={"text-gradient-primary text-xs font-medium"}>
              {" "}
              Unitap Users
            </p>
          </div>
          {stats.map((stat) => (
            <div key={stat.name} className={"flex flex-col gap-2 items-center"}>
              <p className={"text-xl text-space-green font-semibold"}>
                {/* {numberWithCommas(typeof stat.number == 'string' ? parseFloat(stat.number) : stat.number)} */}
                {numberWithCommas(stat.number)}
              </p>
              <p className={"text-gradient-primary text-xs font-medium"}>
                {stat.name}
              </p>
            </div>
          ))}
          <div className="flex flex-col gap-2 items-center">
            <p className={"text-xl text-space-green font-semibold"}>
              {gasClaimedCount}
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
