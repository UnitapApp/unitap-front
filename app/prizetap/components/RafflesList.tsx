"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Prize } from "@/types";
import Icon from "@/components/ui/Icon";
import {
  ClaimAndEnrollButton,
  ClaimPrizeButton,
  EnrolledButton,
} from "@/components/ui/Button/button";
import styled from "styled-components";
import { DV } from "@/components/ui/designVariables";
import Tooltip from "@/components/ui/Tooltip";
import { numberWithCommas } from "@/utils/numbers";
import { LineaRaffleCard } from "./Linea";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useSearchParams } from "next/navigation";
import { useUserProfileContext } from "@/context/userProfile";
import Image from "next/image";
import { FAST_INTERVAL, LINEA_RAFFLE_PK } from "@/constants";
import { getAssetUrl, replacePlaceholders, shortenAddress } from "@/utils";

import { zeroAddress } from "viem";
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh";
import ReactMarkdown from "react-markdown";
import Markdown from "@/app/tokentap/components/Markdown";
import RaffleCard from "./raffle-card";

export const Action = styled.div`
  display: flex;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    flex-direction: column;
  }
`;

const RafflesList = () => {
  const params = useSearchParams();
  const { rafflesList } = usePrizeTapContext();
  const [highlightedPrize, setHighlightedPrize] = useState("");

  const prizesSortListMemo = useMemo(
    () =>
      rafflesList.sort((a, b) => {
        const lowerHighlightChainName = highlightedPrize.toLowerCase();

        if (a.name.toLowerCase() === lowerHighlightChainName) return -1;
        if (b.name.toLowerCase() === lowerHighlightChainName) return 1;

        return 0;
      }),
    [rafflesList, highlightedPrize],
  );

  useEffect(() => {
    const highlightedPrize = params.get("icebox");

    setHighlightedPrize(highlightedPrize || "");
  }, [params, setHighlightedPrize]);

  return (
    <div className="wrap mb-4 grid w-full gap-4 md:flex-row">
      {!!prizesSortListMemo.length && (
        <div>
          <RaffleCardWrapper
            raffle={prizesSortListMemo[0]}
            isHighlighted={
              highlightedPrize.toLocaleLowerCase() ===
              rafflesList[0].name.toLocaleLowerCase()
            }
          />
        </div>
      )}

      {prizesSortListMemo.slice(1).map((rafflesList, index) => (
        <div key={index}>
          <RaffleCardWrapper key={rafflesList.pk} raffle={rafflesList} />
        </div>
      ))}
    </div>
  );
};

const RaffleCardWrapper: FC<{ raffle: Prize; isHighlighted?: boolean }> = (
  props,
) => {
  if (props.raffle.pk === LINEA_RAFFLE_PK)
    return <LineaRaffleCard {...props} />;

  return <RaffleCard {...props} />;
};

export default RafflesList;
