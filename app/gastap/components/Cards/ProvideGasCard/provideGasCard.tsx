"use client";

import React, { useContext, useEffect } from "react";
import { LightOutlinedButton } from "@/components/ui/Button/button";
import ChainCard from "./chainCard";
import { FundContext } from "../../Modals/FundGasModal";
import { useGasTapContext } from "@/context/gasTapProvider";

const ProvideGasCard = () => {
  const [chainListIndex, setChainListIndex] = React.useState(0);
  const { chainList: chainListUnfiltered } = useGasTapContext();

  const chainList = chainListUnfiltered.filter((chain) => !chain.isDeprecated);

  const { setIsOpen } = useContext(FundContext);

  useEffect(() => {
    setTimeout(() => {
      if (chainListIndex > chainList.length - 5) {
        setChainListIndex(0);
      } else {
        setChainListIndex(chainListIndex + 4);
      }
    }, 10000);
  }, [chainListIndex, chainList]);

  if (chainList.length > 0) {
    return (
      <div className="provide-gas flex w-full flex-col items-center rounded-xl border-2 border-gray30 bg-gray40 pb-4 sm:flex-row sm:pb-0">
        <section className={"flex flex-col md:flex-row"}>
          <ChainCard key={chainListIndex} chain={chainList[chainListIndex]} />
          <ChainCard
            key={chainListIndex + 1}
            chain={chainList[(chainListIndex + 1) % chainList.length]}
          />
        </section>
        <section className={"flex flex-col md:flex-row"}>
          <ChainCard
            key={chainListIndex + 2}
            chain={chainList[(chainListIndex + 2) % chainList.length]}
          />
          <ChainCard
            key={chainListIndex + 3}
            chain={chainList[(chainListIndex + 3) % chainList.length]}
          />
        </section>
        <span className="m-auto" onClick={setIsOpen.bind(null, true)}>
          <LightOutlinedButton
            className={"!w-48 !bg-gray00 lg:!w-60"}
            $fontSize="14"
            height="46px"
          >
            Contribute Gas
          </LightOutlinedButton>
        </span>
      </div>
    );
  }

  return <></>;
};

export default ProvideGasCard;
