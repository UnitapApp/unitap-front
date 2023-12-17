"use client";

import { useEffect, useMemo, useState } from "react";
import { Network } from "@/types";
import EmptyChainListCard from "./EmptyChainListCard";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { useSearchParams } from "next/navigation";
import ChainCard from "./ChainCard";

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

        if (oneTimeClaimedGasList.find((item) => item.chain.pk === a.pk)) {
          return 10;
        }

        if (oneTimeClaimedGasList.find((item) => item.chain.pk === b.pk)) {
          return -10;
        }

        return 0;
      }),
    [
      activeClaimHistory,
      chainListSearchResult,
      highlightedChain,
      oneTimeClaimedGasList,
    ]
  );

  useEffect(() => {
    const highlightedChain = (params.get("highlightedChain") ??
      params.get("hc")) as string;

    if (highlightedChain) {
      setSelectedNetwork(Network.ALL);
    }

    setHighlightedChain(highlightedChain || "");
  }, [params, setHighlightedChain, setSelectedNetwork]);

  return (
    <div className="chain-list-wrapper pt-5 pb-2 w-full mb-20">
      <div>
        {!chainList.length || isGasTapAvailable ? (
          <>
            {!!chainListMemo.length && (
              <ChainCard
                isHighlighted={
                  chainListMemo[0].chainName.toLowerCase() ===
                  highlightedChain.toLowerCase()
                }
                chain={chainListMemo[0]}
              />
            )}

            {chainListMemo.slice(1).map((chain) => (
              <ChainCard chain={chain} key={chain.pk} />
            ))}
          </>
        ) : (
          <div
            className="text-white text-center mt-20"
            data-testid="chain-list-loading"
          >
            Gas Tap is not available right now
          </div>
        )}
        {chainListSearchResult.length === 0 && chainList.length && (
          <EmptyChainListCard />
        )}
      </div>
    </div>
  );
};

export default ChainList;
