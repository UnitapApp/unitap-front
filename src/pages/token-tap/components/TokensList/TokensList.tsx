import React, { useContext } from "react";
import styled from "styled-components/";
import { DV } from "components/basic/designVariables";
import { ClaimButton, ClaimedButton, NoCurrencyButton, SecondaryButton } from "components/basic/Button/button";
import { ClaimContext } from "hooks/useChainList";
import { formatWeiBalance } from "utils/numbers";
import Icon from "components/basic/Icon/Icon";
import { useWeb3React } from "@web3-react/core";
import useSelectChain from "hooks/useSelectChain";
import { getChainIcon } from "utils";
import { Chain } from "../../../../types";
import {TokenTapContext} from "../../../../hooks/token-tap/tokenTapContext";

const Action = styled.div`
  display: flex;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    flex-direction: column;
  }
`;

const AddMetamaskButton = styled(SecondaryButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  background-color: #21212c;
  border: 2px solid #1b1b26;
  gap: ${DV.sizes.baseMargin * 1.5}px;
  font-weight: 500;

  img {
    width: 20px;
    height: 20px;
    transform: scale(1.4);
  }
`;

const TokensList = () => {
  const { chainList, chainListSearchResult } = useContext(ClaimContext);
  const { tokensList } = useContext(TokenTapContext);

  const windowSize = window.innerWidth;

  return (
    <div className="tokens-list-wrapper py-6 mb-20 w-full">
      {chainList.length === 0 && (
        <div style={{ color: "white", textAlign: "center" }} data-testid="chain-list-loading">
          Loading...
        </div>
      )}
      {chainListSearchResult.map((token) => {
        return <TokenCard token={token} key={token.pk} />;
      })}
      {chainListSearchResult.length === 0 && chainList.length && (
        <Icon
          className="mb-4"
          iconSrc={
            windowSize > 992 ? "assets/images/claim/empty-list.svg" : "assets/images/claim/empty-list-mobile.svg"
          }
          width="100%"
        />
      )}
      <FinalVersionCard />
    </div>
  );
};

const TokenCard = ({ token }: { token: Chain }) => {
  const { openClaimModal } = useContext(ClaimContext);

  const addAndSwitchToChain = useSelectChain();
  const { account } = useWeb3React();
  const active = !!account;

  return (
    <div key={token.chainId}>
      <div className="token-card flex flex-col items-center justify-center w-full mb-4">
        <span className="flex flex-col">
          <div
            className="pt-4 pr-6 pb-4 pl-3 bg-gray40 w-full flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center rounded-t-xl">
            <div className="hover:cursor-pointer items-center flex mb-6 sm:mb-0">
              <span className="chain-logo-container w-11 h-11 flex justify-center mr-3">
                <img className="chain-logo w-auto h-full" src={getChainIcon(token)} alt="chain logo" />
              </span>
              <span className="w-max">
                <p
                  className="text-white text-center md:text-left flex mb-2"
                  data-testid={`chain-name-${token.pk}`}
                >
                  {token.chainName}
                  <img className="arrow-icon mt-1 ml-1 w-2" src="assets/images/arrow-icon.svg" alt="arrow" />
                </p>
                <p className="text-xs text-white font-medium">Decentralized verification system</p>
              </span>
            </div>

            <div className={"flex items-center justify-end flex-col md:flex-row !w-full sm:w-auto"}>
              <div className="w-full mb-2 md:mb-0 md:w-auto md:mr-4 items-center md:items-end">
                <AddMetamaskButton
                  disabled={!active}
                  data-testid={`chain-switch-${token.pk}`}
                  onClick={() => addAndSwitchToChain(token)}
                  className="font-medium hover:cursor-pointer mx-auto text-sm !w-[220px] md:!w-auto"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                    alt="metamask logo"
                  />
                  Add
                </AddMetamaskButton>
              </div>

              <Action className={"w-full sm:w-auto items-center sm:items-end "}>
                {/* todo migrate buttom logic*/}
                {token.needsFunding ? (
                  <NoCurrencyButton disabled fontSize="13px">
                    Empty
                  </NoCurrencyButton>
                ) : token.unclaimed !== 0 ? (
                  <ClaimButton
                    data-testid={`chain-show-claim-${token.pk}`}
                    mlAuto
                    onClick={() => openClaimModal(token.pk)}
                    className="text-sm m-auto"
                  >
                    <p>{`Claim ${formatWeiBalance(token.maxClaimAmount)} ${token.symbol}`}</p>
                  </ClaimButton>
                ) : (
                  <ClaimedButton
                    data-testid={`chain-claimed-${token.pk}`}
                    mlAuto
                    icon="../assets/images/claim/claimedIcon.svg"
                    iconWidth={24}
                    iconHeight={20}
                    onClick={() => openClaimModal(token.pk)}
                    className="text-sm bg-dark-space-green border-2 border-space-green m-auto"
                  >
                    <p className="text-space-green flex-[2] font-medium text-sm">Claimed!</p>
                  </ClaimedButton>
                )}
              </Action>
            </div>
          </div>
          <p className="text-xs text-gray100 pl-6 md:pl-16 pt-4 pr-6 text-justify pb-10 bg-gray40">
            Anyone is welcome to play to help verify those they already know. The first 2000 users who are
            verified in Aura can claim 2 xDai. You do not need to play to become verified by Aura; You just need
            to know one person who is playing Aura. To meet other Aura players and discuss strategy, join the Aura
            discord.
          </p>
        </span>
        <div
          className={
            "bg-gray30 w-full gap-4 md:gap-0 items-center flex flex-col md:flex-row rounded-b-xl px-4 py-2.5 pr-6 justify-between"
          }
        >
          <div className="flex gap-x-2 items-center text-xs sm:text-sm">
            <p className="text-gray100">
              <span className="text-white">1,137 </span> of <span className="text-white"> 2,000 </span> are left
              to claim on Gnosis chain
            </p>
            <Icon iconSrc={getChainIcon(token)} width="auto" height="16px" />
          </div>

          <div className="flex gap-x-6 items-center">
            <Icon
              className="cursor-pointer"
              iconSrc="assets/images/token-tap/twitter-icon.svg"
              width="auto"
              height="20px"
            />
            <Icon
              className="cursor-pointer"
              iconSrc="assets/images/token-tap/discord-icon.svg"
              width="auto"
              height="20px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FinalVersionCard = () => {
  return (
    <div className="token-tap__final-version-container w-full h-60 bg-gray20 rounded-xl relative">
      <div
        className="token_tap__final-version-card flex flex-col items-center text-center min-w-[240px] sm:flex-row sm:w-max py-3 sm:py-2 px-3.5 gap-5 sm:gap-9 bg-gray50 border-2 border-gray60 rounded-lg absolute bottom-7 left-1/2 -translate-x-1/2">
        <p className="token-tap__final-version-card__text text-gradient-primary text-xs font-semibold">The Final
          version that contains more tokens will be Launched on May 2023.</p>
        <p
          className="token-tap__final-version-card__read-more text-gray100 underline text-xs font-semibold cursor-pointer">Read
          More</p>
      </div>
    </div>
  );
};

export default TokensList;
