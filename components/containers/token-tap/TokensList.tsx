"use client";

import { useState, useMemo, useEffect } from "react";

import TokenCard from "./TokenCard";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { useSearchParams } from "next/navigation";

import Styles from "./header.module.scss";

const TokensList = () => {
  const { tokensList, tokensListLoading, tokenListSearchResult } =
    useTokenTapContext();
  const [highlightedToken, setHighlightedToken] = useState("");

  const params = useSearchParams();

  const tokenListMemo = useMemo(
    () =>
      tokenListSearchResult.sort((a, b) => {
        const lowerHighlightChainName = highlightedToken.toLowerCase();

        if (a.name.toLowerCase() === lowerHighlightChainName) return -1;
        if (b.name.toLowerCase() === lowerHighlightChainName) return 1;

        return 0;
      }),
    [tokenListSearchResult, highlightedToken],
  );

  useEffect(() => {
    const highlightedChain = params.get("hc");

    setHighlightedToken(highlightedChain || "");
  }, [params, setHighlightedToken]);

  return (
    <div className="tokens-list-wrapper mb-20 w-full py-6">
      {!!tokenListMemo.length && (
        <TokenCard
          isHighlighted={
            tokenListMemo[0].name.toLowerCase() ===
            highlightedToken.toLowerCase()
          }
          token={tokenListMemo[0]}
        />
      )}

      {tokenListMemo.slice(1).map((token) => (
        <TokenCard token={token} key={token.id} />
      ))}

      {tokenListSearchResult.length === 0 && !!tokensList.length && (
        <div className="my-10" data-testid="tokens-not-found">
          <div className="mx-auto rounded-lg bg-gray30 p-6 text-white shadow-lg">
            <div className="flex h-20 items-center justify-center">
              <h1 className="bg-primaryGradient bg-clip-text text-4xl font-semibold text-transparent">
                404
              </h1>
            </div>
            <p className="mb-6 text-center">
              No network with the current filter could be found.
            </p>
          </div>
        </div>
      )}
      <FinalVersionCard />
    </div>
  );
};

const FinalVersionCard = () => {
  return (
    <div
      className={`${Styles["footer-container"]} relative h-60 w-full rounded-xl bg-gray20`}
    >
      <div className="token_tap__final-version-card absolute bottom-7 left-1/2 flex min-w-[240px] -translate-x-1/2 flex-col items-center gap-5 rounded-lg border-2 border-gray60 bg-gray50 px-3.5 py-3 text-center sm:w-max sm:flex-row sm:gap-9 sm:py-2"></div>
    </div>
  );
};

export default TokensList;
