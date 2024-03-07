"use client";

import {
  SecondaryButton,
  ClaimButton,
  Button,
} from "@/components/ui/Button/button";
import { DV } from "@/components/ui/designVariables";
import { useGasTapContext } from "@/context/gasTapProvider";
import { PK, ClaimReceipt, ClaimReceiptState, ChainType, Chain } from "@/types";
import { formatChainBalance, numberWithCommas } from "@/utils";
import { getChainIcon } from "@/utils/chain";
import { useNetworkSwitcher, useWalletAccount } from "@/utils/wallet";
import { useContext, useMemo } from "react";
import styled from "styled-components";
import { FundContext } from "../../Modals/FundGasModal";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Styles from "./chain-card.module.scss";
import Image from "next/image";

type ChainCardProps = {
  chain: Chain;
  isHighlighted?: boolean;
};

export const AddMetamaskButton = styled(SecondaryButton)`
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

const ChainCard = ({ chain, isHighlighted }: ChainCardProps) => {
  const {
    openClaimModal,
    activeClaimHistory,
    oneTimeClaimedGasList,
    fuelChampionObj,
  } = useGasTapContext();

  const isOneTimeCollected = useMemo(
    () =>
      !!oneTimeClaimedGasList.find(
        (item) =>
          item.status === ClaimReceiptState.VERIFIED &&
          item.chain.pk === chain.pk
      ),
    [chain, oneTimeClaimedGasList]
  );

  const isMonthlyCollected = useMemo(
    () =>
      !!activeClaimHistory.find(
        (claim: ClaimReceipt) =>
          claim.chain.pk === chain.pk &&
          claim.status === ClaimReceiptState.VERIFIED
      ),
    [activeClaimHistory, chain]
  );

  const { setChainId, setIsOpen } = useContext(FundContext);

  const { addAndSwitchChain } = useNetworkSwitcher();
  const { isConnected } = useWalletAccount();

  const handleRefillButtonClicked = (chainId: PK) => {
    setChainId(chainId);
    setIsOpen(true);
  };

  return (
    <div>
      <div
        className={`chain-card ${
          isHighlighted
            ? "before:!inset-[1.5px] p-0 gradient-outline-card mb-20"
            : "mb-4"
        } rounded-3xl flex flex-col items-center justify-center w-full`}
      >
        <div
          className={`pt-4 pr-6 pb-4 pl-3 w-full ${
            isHighlighted ? "bg-g-primary-low" : "bg-bg03"
          } flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center rounded-t-3xl`}
        >
          <div
            // onClick={() => window.open(chain.blockScanAddress, "_blank")}
            className={`${
              isOneTimeCollected ? "opacity-60" : ""
            } items-center flex mb-6 sm:mb-0`}
          >
            <span className="chain-logo-container w-10 h-10 flex justify-center">
              <img
                className="chain-logo w-auto h-[100%]"
                src={getChainIcon(chain)}
                alt={chain.chainName}
              />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p
                  className=" text-white ml-3 text-center sm:text-left"
                  data-testid={`chain-name-${chain.pk}`}
                >
                  {chain.chainName}
                </p>
                <button className="ml-2 text-gray100 text-2xs px-3 py-1 rounded-lg border border-bg06"></button>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <p className="ml-2 text-gray100 text-2xs px-2 py-1 rounded-lg border border-bg06">
                  {chain.chainType}
                </p>
                <p className="text-2xs text-gray100 px-2 py-1 rounded-lg border border-bg06">
                  {chain.isTestnet ? "Testnet" : "Mainnet"}
                </p>
              </div>
            </div>
            <div className=""></div>
          </div>

          <div
            className={
              "flex items-center justify-end flex-col sm:flex-row gap-2 sm:gap-0 sm:w-auto"
            }
          >
            <div className="w-full sm:w-auto items-center sm:items-end">
              {chain.chainType === "EVM" && (
                <AddMetamaskButton
                  disabled={!isConnected}
                  data-testid={`chain-switch-${chain.pk}`}
                  onClick={() => addAndSwitchChain(chain)}
                  className="font-medium hover:cursor-pointer mx-auto sm:mr-4 text-sm !w-[220px] sm:!w-auto"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                    alt="metamask logo"
                  />
                  Add
                </AddMetamaskButton>
              )}
            </div>

            <div className="action flex flex-col md:flex-row w-full sm:w-auto items-center sm:items-end">
              {isMonthlyCollected || isOneTimeCollected ? (
                <Button
                  data-testid={`chain-claimed-${chain.pk}`}
                  $mlAuto
                  onClick={() => openClaimModal(chain.pk)}
                  className={`text-sm ${Styles.claimedButton} !w-[220px] !py-2 m-auto`}
                >
                  <div className="flex-[2] text-left text-xs">
                    <p className="text-space-green font-semibold">
                      Gas Claimed!
                    </p>
                    <p
                      className={`${
                        isOneTimeCollected
                          ? "text-warning2"
                          : "text-secondary-text"
                      } text-2xs font-normal`}
                    >
                      {isOneTimeCollected
                        ? "Not claimable anymore"
                        : "Claimable again in next round"}
                    </p>
                  </div>
                  <Image
                    width={24}
                    height={20}
                    src={`/assets/images/${
                      isOneTimeCollected
                        ? "gas-tap/claimed-logo.svg"
                        : "claim/claimedIcon.svg"
                    }`}
                    alt="claimed logo"
                  />
                </Button>
              ) : chain.needsFunding && chain.chainType !== ChainType.SOLANA ? (
                // <Button
                //   onClick={() => handleRefillButtonClicked(chain.pk)}
                //   className="bg-gray60 text-xs !block border-2 !font-normal border-gray100 !w-[220px] !py-1 m-auto"
                // >
                //   <p>Refuel</p>
                //   <p className="text-2xs text-gray90">
                //     This FASET is out of balance
                //   </p>
                // </Button>
                <div className="btn btn--claim btn--sm btn--out-of-balance">
                  Out of Gas
                  <button
                    onClick={() => handleRefillButtonClicked(chain.pk)}
                    className="btn btn--sm btn--refill"
                  >
                    Refuel
                  </button>
                </div>
              ) : !activeClaimHistory.find(
                  (claim: ClaimReceipt) =>
                    claim.chain.pk === chain.pk &&
                    claim.status !== ClaimReceiptState.REJECTED
                ) ? (
                <ClaimButton
                  data-testid={`chain-show-claim-${chain.pk}`}
                  $mlAuto
                  onClick={() => openClaimModal(chain.pk)}
                  className="text-sm !h-11 m-auto"
                >
                  <p>{`Claim ${formatChainBalance(
                    chain.maxClaimAmount,
                    chain.symbol
                  )} ${chain.symbol}`}</p>
                </ClaimButton>
              ) : (
                <ClaimButton
                  data-testid={`chain-show-claim-${chain.pk}`}
                  $mlAuto
                  onClick={() => openClaimModal(chain.pk)}
                  className="text-sm !h-11 before:!bg-gray30 opacity-90 m-auto"
                >
                  <p>Pending ...</p>
                </ClaimButton>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${
            isHighlighted ? "bg-g-primary-low" : "bg-gray30"
          } w-full gap-2 md:gap-0 items-center flex flex-col md:flex-row rounded-b-3xl px-8 justify-between`}
        >
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-gray30"
            } w-full items-center flex rounded-b-xl px-4 justify-between md:justify-start`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Currency
            </p>
            <p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
              {chain.symbol}
            </p>
          </div>

          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-gray30"
            } w-full items-center flex rounded-b-xl px-4 justify-between md:justify-start`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Fuel Champion{" "}
            </p>
            <p className="text-sm font-normal text-white ml-1.5">
              {!!fuelChampionObj[chain.pk] && `@${fuelChampionObj[chain.pk]}`}
            </p>
          </div>
          <Tooltip
            className={`text-xs !cursor-default py-3 w-full max-w-[180px] ${
              isHighlighted
                ? "bg-transparent"
                : chain.isOneTimeClaim
                ? "bg-gray40"
                : "bg-dark-primary"
            }`}
            withoutImage
            text={
              chain.isOneTimeClaim
                ? "You can only claim from this tap once."
                : "You can claim from this tap each round."
            }
          >
            {chain.isOneTimeClaim ? (
              <div className="items-center font-semibold px-4 text-secondary-text flex rounded-none justify-between md:justify-center">
                <p className="flex-1">Single-Claim Tap</p>
                <Icon
                  className="text-white"
                  ml={4}
                  iconSrc="/assets/images/gas-tap/claimable-once.svg"
                />
              </div>
            ) : (
              <div className="items-center font-semibold px-4 text-gray100 flex rounded-none justify-between md:justify-center">
                <p className="flex-1">Periodic Tap</p>
                <Icon
                  className="text-white"
                  ml={4}
                  iconSrc="/assets/images/gas-tap/periodic-tap.svg"
                />
              </div>
            )}
          </Tooltip>
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-gray30"
            } w-full items-center flex rounded-b-xl px-4 justify-between md:justify-center`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              This Round Claims
            </p>
            <p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
              {numberWithCommas(chain.totalClaimsThisRound)}
            </p>
          </div>
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-gray30"
            } w-full items-center flex rounded-b-xl px-4 justify-between md:justify-end`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Total Claims
            </p>
            <p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
              {numberWithCommas(chain.totalClaims)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainCard;
