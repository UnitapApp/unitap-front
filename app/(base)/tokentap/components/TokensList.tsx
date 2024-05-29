"use client";

import { useState, useMemo, useEffect } from "react";

import TokenCard from "./TokenCard";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { useSearchParams } from "next/navigation";

import Styles from "./header.module.scss";
import Image from "next/image";
import Link from "next/link";

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
      {tokensListLoading && tokensList.length === 0 && (
        <div
          style={{ color: "white", textAlign: "center" }}
          data-testid="chain-list-loading"
        >
          Loading...
        </div>
      )}
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
    <Link
      href="/contribution-hub/token-tap"
      className={`${Styles["footer-container"]} group relative flex min-h-[11rem] w-full flex-wrap items-center justify-between rounded-3xl bg-gray20 px-10 transition-all duration-300 hover:opacity-90`}
    >
      <div className="flex md:flex-col">
        <div className="flex items-center gap-4 text-2xl text-white transition-all duration-300 group-hover:-mt-5">
          Want to provide a Token
          <Image
            src="/assets/images/provider-dashboard/ic_link_white.svg"
            width="10"
            height="11"
            alt="link"
          />
        </div>
        <div className="mt-10 text-sm text-[#5A8B9A]">
          If you want to provide something as a prize and set a raffle you can
          use contribution hub.
        </div>
      </div>
      <Image
        className="absolute transition-all duration-300 group-hover:-mb-5 md:static"
        width="278"
        height="152"
        alt="contribute token"
        src="/assets/images/token-tap/token-gas.svg"
      />
    </Link>
  );
};

export default TokensList;
