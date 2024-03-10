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
    [tokenListSearchResult, highlightedToken]
  );

  useEffect(() => {
    const highlightedChain = params.get("hc");

    setHighlightedToken(highlightedChain || "");
  }, [params, setHighlightedToken]);

  return (
    <div className="tokens-list-wrapper py-6 mb-20 w-full">
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
          <div className="bg-gray30 text-white shadow-lg rounded-lg p-6 mx-auto">
            <div className="flex justify-center items-center h-20">
              <h1 className="text-4xl bg-primaryGradient text-transparent bg-clip-text font-semibold">
                404
              </h1>
            </div>
            <p className="text-center mb-6">
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
      className={`${Styles["footer-container"]} group hover:opacity-90 transition-all duration-300 w-full h-44 bg-gray20 rounded-3xl px-10 relative flex items-center justify-between`}
    >
      <div>
        <div className="text-2xl flex group-hover:-mt-5 duration-300 transition-all items-center gap-4 text-white">
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
        className="group-hover:-mb-5 duration-300 transition-all"
        width="278"
        height="152"
        alt="contribute token"
        src="/assets/images/token-tap/token-gas.svg"
      />
    </Link>
  );
};

export default TokensList;
