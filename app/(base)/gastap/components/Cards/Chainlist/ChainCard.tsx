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
import { useContext, useMemo } from "react";
import styled from "styled-components";
import { FundContext } from "../../Modals/FundGasModal";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Styles from "./chain-card.module.scss";
import Image from "next/image";
import GasBalanceRenderer from "./GasBalanceRenderer";

type ChainCardProps = {
  chain: Chain;
  isHighlighted?: boolean;
  isThisRound: boolean;
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

const ChainCard = ({ chain, isHighlighted, isThisRound }: ChainCardProps) => {
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
          item.chain.pk === chain.pk,
      ),
    [chain, oneTimeClaimedGasList],
  );

  const isMonthlyCollected = useMemo(
    () =>
      !!activeClaimHistory.find(
        (claim: ClaimReceipt) =>
          claim.chain.pk === chain.pk &&
          claim.status === ClaimReceiptState.VERIFIED,
      ),
    [activeClaimHistory, chain],
  );

  const { setChainId, setIsOpen } = useContext(FundContext);

  const handleRefillButtonClicked = (chainId: PK) => {
    setChainId(chainId);
    setIsOpen(true);
  };

  return (
    <div>
      <div
        className={`chain-card ${
          isHighlighted
            ? "gradient-outline-card mb-20 p-0 before:!inset-[1.5px]"
            : "mb-4"
        } flex w-full flex-col items-center justify-center rounded-xl`}
      >
        <div
          className={`w-full pb-4 pl-3 pr-6 pt-4 ${
            isHighlighted ? "bg-g-primary-low" : "bg-gray20"
          } flex flex-col items-center justify-between gap-2 rounded-t-xl sm:flex-row sm:gap-0`}
        >
          <div
            onClick={() => window.open(chain.blockScanAddress, "_blank")}
            className={`cursor-pointer ${
              isOneTimeCollected ? "opacity-60" : ""
            } mb-6 flex items-center sm:mb-0`}
          >
            <span className="chain-logo-container flex h-10 w-10 justify-center">
              <img
                className="chain-logo h-[100%] w-auto"
                src={getChainIcon(chain)}
                alt={chain.chainName}
              />
            </span>
            <p
              className=" ml-3 text-center text-white sm:text-left"
              data-testid={`chain-name-${chain.pk}`}
            >
              {chain.chainName}
            </p>
            <Image
              width={8}
              height={8}
              className="arrow-icon ml-1.5 mt-1 h-2 w-2"
              src="/assets/images/arrow-icon.svg"
              alt="arrow"
            />
            <p className="ml-2 rounded bg-gray30 px-2 py-1 text-2xs text-gray">
              {chain.chainType}
            </p>
            <p className="ml-2 rounded bg-gray30 px-2 py-1 text-2xs text-gray">
              {chain.isTestnet ? "Testnet" : "Mainnet"}
            </p>
          </div>

          <div
            className={
              "flex flex-col items-center justify-end gap-2 sm:w-auto sm:flex-row sm:gap-0"
            }
          >
            <div className="action flex w-full flex-col items-center sm:w-auto sm:items-end md:flex-row">
              {chain.chainType !== ChainType.SOLANA && (
                <button
                  disabled={chain.isDeprecated}
                  onClick={() => handleRefillButtonClicked(chain.pk)}
                  className={`${
                    chain.needsFunding ? "bg-unitap-galaxy" : "bg-gray30"
                  } relative mr-4 rounded-xl p-[2px] text-sm font-semibold disabled:opacity-60`}
                >
                  <div className="flex h-11 items-center gap-3 rounded-xl bg-gray50 p-2 text-secondary-text">
                    <Image
                      src="/assets/images/gas-tap/refuel-logo.svg"
                      width={17}
                      height={22}
                      alt="refuel"
                    />
                    <p>Refuel</p>
                  </div>
                </button>
              )}

              {isMonthlyCollected || isOneTimeCollected ? (
                <Button
                  data-testid={`chain-claimed-${chain.pk}`}
                  $mlAuto
                  onClick={() => openClaimModal(chain.pk)}
                  className={`text-sm ${Styles.claimedButton} m-auto !w-[220px] !py-2`}
                >
                  <div className="flex-[2] text-left text-xs">
                    <p className="font-semibold text-space-green">
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
                <ClaimButton
                  data-testid={`chain-refuel-claim-${chain.pk}`}
                  $mlAuto
                  className="m-auto !h-11 !cursor-not-allowed bg-g-dark-primary-gradient text-sm"
                >
                  <p className="!bg-g-dark-primary-gradient">{`Claim ${formatChainBalance(
                    chain.maxClaimAmount,
                    chain.symbol,
                  )} ${chain.symbol}`}</p>
                </ClaimButton>
              ) : !activeClaimHistory.find(
                  (claim: ClaimReceipt) =>
                    claim.chain.pk === chain.pk &&
                    claim.status !== ClaimReceiptState.REJECTED,
                ) ? (
                <ClaimButton
                  data-testid={`chain-show-claim-${chain.pk}`}
                  $mlAuto
                  disabled={chain.isDeprecated}
                  onClick={() => openClaimModal(chain.pk)}
                  className="m-auto !h-11 text-sm"
                >
                  <p>{`Claim ${formatChainBalance(
                    chain.maxClaimAmount,
                    chain.symbol,
                  )} ${chain.symbol}`}</p>
                </ClaimButton>
              ) : (
                <ClaimButton
                  data-testid={`chain-show-claim-${chain.pk}`}
                  $mlAuto
                  onClick={() => openClaimModal(chain.pk)}
                  className="m-auto !h-11 text-sm opacity-90 before:!bg-gray30"
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
          } flex w-full flex-col items-center justify-between gap-1 rounded-b-xl md:flex-row md:gap-0`}
        >
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-gray30"
            } flex w-full items-center justify-between rounded-b-xl pl-4 md:justify-start`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Currency
            </p>
            <p className="chain-card__info__value ml-1.5 font-mono text-sm text-white">
              {chain.symbol}
            </p>
          </div>

          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-gray30"
            } flex w-full items-center justify-between rounded-b-xl pl-4 md:justify-start`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Fuel Champion{" "}
            </p>
            <p className="ml-1.5 text-sm font-normal text-white">
              {!!fuelChampionObj[chain.pk] && `@${fuelChampionObj[chain.pk]}`}
            </p>
          </div>
          <Tooltip
            className={`w-full max-w-[180px] !cursor-default py-3 text-xs ${
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
              <div className="flex items-center justify-between rounded-none pl-4 font-semibold text-secondary-text md:justify-center">
                <p className="flex-1">Single-Claim Tap</p>
                <Icon
                  className="mx-4 text-white"
                  iconSrc="/assets/images/gas-tap/claimable-once.svg"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-none px-4 font-semibold text-gray100 md:justify-center">
                <p className="flex-1">Periodic Tap</p>
                <Icon
                  className="mx-auto text-white"
                  iconSrc="/assets/images/gas-tap/periodic-tap.svg"
                />
              </div>
            )}
          </Tooltip>
          <div
            key={isThisRound && !chain.isDeprecated ? 1 : 0}
            className={`${
              isThisRound ? "bg-transparent" : "bg-gray30"
            } ${chain.isDeprecated ? "" : "animate-fadeToggle"} flex w-full items-center justify-between rounded-b-xl px-4 transition-opacity duration-300 ease-in-out md:justify-center`}
          >
            <p className="text-sm text-gray90">
              {isThisRound && !chain.isDeprecated
                ? "This Round Claims"
                : "Total Claims"}
            </p>
            <p className="ml-1.5 font-mono text-sm text-white">
              {isThisRound && !chain.isDeprecated
                ? numberWithCommas(chain.totalClaimsThisRound)
                : numberWithCommas(chain.totalClaims)}
            </p>
          </div>

          <Tooltip
            text={`${chain.remainingClaimNumber} claims are left`}
            withoutImage
          >
            <div
              className={`${
                isHighlighted ? "bg-transparent" : "bg-gray30"
              } flex w-full items-center justify-between rounded-b-xl px-4 md:justify-end`}
            >
              <p
                className={`text-sm ${chain.currentFuelLevel > 4 ? "text-gray90" : chain.currentFuelLevel >= 2 ? "text-[#EBD14A]" : "text-error"} `}
              >
                Balance:
              </p>
              <GasBalanceRenderer balance={chain.currentFuelLevel} />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChainCard;
