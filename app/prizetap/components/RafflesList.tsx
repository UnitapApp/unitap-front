"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Prize } from "@/types";
import styled from "styled-components";
import { DV } from "@/components/ui/designVariables";
import { LineaRaffleCard } from "./Linea";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useSearchParams } from "next/navigation";
import { LINEA_RAFFLE_PK } from "@/constants";

import RaffleCard from "./raffle-card";

export const Action = styled.div`
  display: flex;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    flex-direction: column;
  }
`;

const RafflesList = () => {
  const params = useSearchParams();
  const { rafflesList, searchPhrase } = usePrizeTapContext();
  const [highlightedPrize, setHighlightedPrize] = useState("");

  const prizesSortListMemo = useMemo(() => {
    const raffleList = rafflesList.sort((a, b) => {
      const lowerHighlightChainName = highlightedPrize.toLowerCase();

      if (a.name.toLowerCase() === lowerHighlightChainName) return -1;
      if (b.name.toLowerCase() === lowerHighlightChainName) return 1;

      return 0;
    });
    const searchPhraseLowerCase = searchPhrase.toLowerCase();

    return raffleList.filter(
      (raffle) =>
        raffle.name.toLowerCase().includes(searchPhraseLowerCase) ||
        raffle.creatorProfile?.username
          .toLowerCase()
          .includes(searchPhraseLowerCase) ||
        raffle.creatorName?.toLowerCase().includes(searchPhraseLowerCase),
    );
  }, [rafflesList, searchPhrase, highlightedPrize]);

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
