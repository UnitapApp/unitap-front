"use client";

import { useEffect, useMemo, useState } from "react";
import { Network } from "@/types";
import EmptyChainListCard from "./EmptyChainListCard";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { useSearchParams } from "next/navigation";
import ChainCard from "./ChainCard";
import { useFastRefresh } from "@/utils/hooks/refresh";

const ChainList = () => {
  const {
    chainList,
    chainListSearchResult,
    setSelectedNetwork,
    activeClaimHistory,
    oneTimeClaimedGasList,
  } = useGasTapContext();

  const { isGasTapAvailable } = useUserProfileContext();

  const [highlightedChain, setHighlightedChain] = useState("");

  const params = useSearchParams();

  const chainListMemo = useMemo(
    () =>
      chainListSearchResult.sort((a, b) => {
        const lowerHighlightChainName = highlightedChain.toLowerCase();

        if (a.chainName.toLowerCase() === lowerHighlightChainName) return -1;
        if (b.chainName.toLowerCase() === lowerHighlightChainName) return 1;

        // if (oneTimeClaimedGasList.find((item) => item.chain.pk === a.pk)) {
        //   return 10;
        // }

        // if (oneTimeClaimedGasList.find((item) => item.chain.pk === b.pk)) {
        //   return -10;
        // }

        return 0;
      }),
    [chainListSearchResult, highlightedChain],
  );

  useEffect(() => {
    const highlightedChain = (params.get("highlightedChain") ??
      params.get("hc")) as string;

    if (highlightedChain) {
      setSelectedNetwork(Network.ALL);
    }

    setHighlightedChain(highlightedChain || "");
  }, [params, setHighlightedChain, setSelectedNetwork]);

  const [isThisRound, setIsThisRound] = useState(true);

  useFastRefresh(() => {
    setIsThisRound((prevIsThisRound) => !prevIsThisRound);
  }, []);

  return (
    <div className="chain-list-wrapper mb-20 w-full pb-2 pt-5">
      <div>
        {!chainList.length || isGasTapAvailable ? (
          <>
            {!!chainListMemo.length && (
              <ChainCard
                isThisRound={isThisRound}
                isHighlighted={
                  chainListMemo[0].chainName.toLowerCase() ===
                  highlightedChain.toLowerCase()
                }
                chain={chainListMemo[0]}
              />
            )}

            {chainListMemo.slice(1).map((chain) => (
              <ChainCard
                isThisRound={isThisRound}
                chain={chain}
                key={chain.pk}
              />
            ))}
          </>
        ) : (
          <div
            className="mt-20 text-center text-white"
            data-testid="chain-list-loading"
          >
            Gas Tap is not available right now
          </div>
        )}
        {chainListSearchResult.length === 0 && !!chainList.length && (
          <EmptyChainListCard />
        )}
      </div>
    </div>
  );
};

export default ChainList;
