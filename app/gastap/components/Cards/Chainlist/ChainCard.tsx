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
import { FC, useContext, useMemo } from "react";
import styled from "styled-components";
import { FundContext } from "../../Modals/FundGasModal";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Styles from "./chain-card.module.scss";
import Image from "next/image";
import Link from "next/link";

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
            : "mb-6"
        } rounded-3xl flex flex-col items-center justify-center w-full`}
      >
        <div
          className={`pt-4 pr-6 pb-4 pl-3 w-full ${
            isHighlighted ? "bg-g-primary-low" : "bg-bg03"
          } flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center rounded-t-3xl`}
        >
          <div
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
                <Link href={chain.blockScanAddress} target="_blank" className="ml-2 text-gray100 text-2xs px-3 py-1 rounded-xl border border-bg06 bg-bg04 w-10 h-6">
                  <Icon iconSrc="/icons/network.svg" />
                </Link>
              {chain.chainType === "EVM" && (
                 <button       
                    data-testid={`chain-switch-${chain.pk}`}
                    disabled={!isConnected}
                    onClick={() => addAndSwitchChain(chain)}
                    className="text-gray100 text-2xs px-3 py-1 rounded-xl border border-bg06 h-6 w-10 disabled:opacity-60 bg-bg04">
                  <Icon iconSrc="/icons/plus.svg" />
                </button>
              )}
              </div>
              <div className="flex items-center gap-3 ml-3 mt-2">
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

            <div className="action flex flex-col md:flex-row w-full sm:w-auto items-center sm:items-end">
              {chain.chainType !== ChainType.SOLANA && (
                <button
                  onClick={() => handleRefillButtonClicked(chain.pk)}
                  className={`${
                    chain.needsFunding ? "bg-unitap-galaxy" : "bg-gray30"
                  } relative text-sm font-semibold mr-4 rounded-xl p-[2px]`}
                >
                  <div className="bg-gray50 h-11 text-secondary-text rounded-xl p-2 flex items-center gap-3">
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
                <ClaimButton
                  data-testid={`chain-refuel-claim-${chain.pk}`}
                  $mlAuto
                  className="text-sm !h-11 !cursor-not-allowed m-auto bg-g-dark-primary-gradient"
                >
                  <p className="!bg-g-dark-primary-gradient">{`Claim ${formatChainBalance(
                    chain.maxClaimAmount,
                    chain.symbol
                  )} ${chain.symbol}`}</p>
                </ClaimButton>
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
            isHighlighted ? "bg-g-primary-low" : "bg-bg04"
          } w-full gap-4 md:gap-0 items-center flex flex-col md:flex-row rounded-b-3xl pl-4 justify-between`}
        >
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-bg04"
            } items-center flex justify-between md:justify-start`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Currency:{' '}
            </p>
            <p className="chain-card__info__value text-sm text-gray100 ml-1.5">
              {chain.symbol}
            </p>
          </div>

          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-bg04"
            } items-center flex rounded-b-xl h-12 justify-between md:justify-start`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Top Catalyst:{" "}
            </p>
            <p className="text-sm font-normal text-gray100 ml-1.5">
              {!!fuelChampionObj[chain.pk] ? `@${fuelChampionObj[chain.pk]}`: '--'}
            </p>
          </div>
          <Tooltip
            className={`text-sm h-10 rounded-t-2xl px-3 !cursor-default py-3 w-56 self-end ${
              isHighlighted
                ? "bg-transparent"
                : "bg-bg00"
            }`}
            withoutImage
            text={
              chain.isOneTimeClaim
                ? "You can only claim from this tap once."
                : "You can claim from this tap each round."
            }
          >
            {chain.isOneTimeClaim ? (
              <div className="items-center flex text-secondary-text justify-between md:justify-center">
                <p className="flex-1">Single Shot Faucet</p>
                <Icon
                  className="text-white"
                  iconSrc="/assets/images/gas-tap/claimable-once.svg"
                />
              </div>
            ) : (
              <div className="items-center text-gray100 flex rounded-none justify-between md:justify-center">
                <p className="flex-1 text-[#689E7A]">Periodic Tap</p>
                <Icon
                  className="text-[#689E7A]"
                  iconSrc="/assets/images/gas-tap/periodic-tap.svg"
                />
              </div>
            )}
          </Tooltip>

          
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-bg04"
            } items-center flex rounded-b-3xl justify-between md:justify-center`}
          >
            <p className="text-sm text-gray90">
              This Round Claims
            </p>
            <p className="text-sm text-gray100 ml-1.5">
              {numberWithCommas(chain.totalClaimsThisRound)}
            </p>
          </div>
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-bg04"
            } items-center flex rounded-b-xl justify-between md:justify-end`}
          >
            <p className="text-sm text-gray90">
              Total Claims
            </p>
            <p className="text-sm text-gray100 ml-1.5">
              {numberWithCommas(chain.totalClaims)}
            </p>
          </div>
          <div
            className={`${
              isHighlighted ? "bg-transparent" : "bg-gray30"
            } w-full items-center flex rounded-b-xl px-4 justify-between md:justify-end`}
          >
            <p className="chain-card__info__title text-sm text-gray90">
              Balance:
            </p>
            <GasBalanceRenderer balance={chain.currentFuelLevel} />
          </div>
        </div>
      </div>
    </div>
  );
};

const GasBalanceRenderer: FC<{ balance: number }> = ({ balance }) => {
  if (balance > 1) {
    return (
      <div className="flex items-center ml-3 gap-2">
        {Array.from(new Array(balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-space-green" key={key} />
        ))}
        {Array.from(new Array(5 - balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-gray60" key={key} />
        ))}
      </div>
    );
  }

  if (balance == 1)
    return (
      <div className="flex items-center ml-3 gap-2">
        {Array.from(new Array(balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-yellow-600" key={key} />
        ))}
        {Array.from(new Array(5 - balance)).map((_, key) => (
          <span className="w-3 h-1 rounded-[2px] bg-gray60" key={key} />
        ))}
      </div>
    );

  return (
    <div className="flex items-center ml-3 gap-2">
      {Array.from(new Array(5)).map((_, key) => (
        <span
          className="w-3 h-[5px] rounded-[8px] border-[1px] bg-gray60 border-error"
          key={key}
        />
      ))}
    </div>
  );
};

export default ChainCard;
