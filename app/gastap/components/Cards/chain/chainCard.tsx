"use client";

import ClaimButton from "./claimButton";
import { useGasTapContext } from "@/context/gasTapProvider";
import { PK, ClaimReceipt, ClaimReceiptState, ChainType, Chain } from "@/types";
import { formatChainBalance, numberWithCommas } from "@/utils";
import { getChainIcon } from "@/utils/chain";
import { useNetworkSwitcher, useWalletAccount } from "@/utils/wallet";
import { FC, useContext, useMemo } from "react";
import { FundContext } from "../../Modals/FundGasModal";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Image from "next/image";
import Link from "next/link";
import { SecondaryButton } from "@/components/ui/Button/button";
import styled from "styled-components";
import { DV } from "@/components/ui/designVariables";
import GasBalanceRenderer from "./gasBalanceRenderer";

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

type ChainCardProps = {
  chain: Chain;
  isHighlighted?: boolean;
  isThisRound: boolean;
};

const ExpandableLink: FC<{
  label: string;
  icon: string;
  link: string;
}> = ({ icon, label, link }) => {
  return (
    <Link
      href={link}
      target="_blank"
      className="group ml-2 flex h-6 w-10 items-center gap-4 overflow-hidden rounded-xl border border-bg06 bg-bg04 px-3 py-1 text-2xs text-gray100 transition-all hover:w-32"
    >
      <Icon iconSrc={icon} alt="network" />
      <span className="invisible group-hover:visible">{label}</span>
      <Icon
        alt="link"
        className="invisible group-hover:visible"
        iconSrc="/assets/images/gas-tap/external-link.svg"
      />
    </Link>
  );
};

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

  const { addAndSwitchChain } = useNetworkSwitcher();
  const { isConnected } = useWalletAccount();

  const handleRefillButtonClicked = (chainId: PK) => {
    setChainId(chainId);
    setIsOpen(true);
  };

  const isChainRefuelFine = chain.currentFuelLevel >= 2;

  return (
    <article
      className={`${
        isHighlighted
          ? "gradient-outline-card mb-20 p-0 before:!inset-[1.5px]"
          : "mb-6"
      } flex w-full flex-col items-center justify-center rounded-3xl border border-bg04`}
    >
      <div
        className={`w-full border-2 border-bg03 pb-4 pl-3 pr-6 pt-4 ${
          isHighlighted ? "bg-g-primary-low" : "bg-bg01"
        } flex flex-col items-center justify-between gap-2 rounded-t-3xl sm:flex-row sm:gap-0`}
      >
        <div
          className={`${
            isOneTimeCollected ? "opacity-60" : ""
          } mb-6 flex items-center gap-4 sm:mb-0`}
        >
          <span className="chain-logo-container flex h-10 w-10 justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="chain-logo h-[100%] w-auto"
              src={getChainIcon(chain)}
              alt={chain.chainName}
            />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p
                className=" ml-3 text-center text-white sm:text-left"
                data-testid={`chain-name-${chain.pk}`}
              >
                {chain.chainName}
              </p>

              <ExpandableLink
                icon="/icons/network.svg"
                label="Website"
                link={chain.blockScanAddress}
              />
              {/* <Link
                href={chain.blockScanAddress}
                target="_blank"
                className="ml-2 h-6 w-10 rounded-xl border border-bg06 bg-bg04 px-3 py-1 text-2xs text-gray100"
              >
                <Icon iconSrc="/icons/network.svg" />
              </Link> */}
              {chain.chainType === "EVM" && (
                <button
                  data-testid={`chain-switch-${chain.pk}`}
                  disabled={!isConnected}
                  onClick={() => addAndSwitchChain(chain)}
                  className="h-6 w-10 rounded-xl border border-bg06 bg-bg04 px-3 py-1 text-2xs text-gray100 disabled:opacity-60"
                >
                  <Icon iconSrc="/icons/plus.svg" />
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <p className="ml-2 rounded-lg border border-bg06 px-2 py-1 text-2xs text-gray100">
                {chain.chainType}
              </p>
              <p className="rounded-lg border border-bg06 px-2 py-1 text-2xs text-gray100">
                {chain.isTestnet ? "Testnet" : "Mainnet"}
              </p>
            </div>
          </div>
          <div className=""></div>
        </div>

        <div
          className={
            "flex flex-col items-center justify-end gap-2 sm:w-auto sm:flex-row sm:gap-0"
          }
        >
          <div className="action flex w-full flex-col items-center gap-4 sm:w-auto sm:items-end md:flex-row">
            {chain.chainType !== ChainType.SOLANA && (
              <button
                onClick={() => handleRefillButtonClicked(chain.pk)}
                className={`refuel-button relative mr-4 w-28 rounded-3xl p-[2px] text-sm font-semibold ${
                  isChainRefuelFine ? "refuel-fine" : ""
                }`}
              >
                <div className="flex h-11 items-center justify-center gap-4 rounded-3xl p-2 px-4 text-[#6DD0E6]">
                  <p>Refuel</p>
                  {isChainRefuelFine || (
                    <Image
                      src="/assets/images/gas-tap/refuel-logo.svg"
                      width={17}
                      height={22}
                      alt="refuel"
                    />
                  )}
                </div>
              </button>
            )}

            <ClaimButton
              onClick={() => openClaimModal(chain.pk)}
              isClaimed={isMonthlyCollected || isOneTimeCollected}
              amount={formatChainBalance(chain.maxClaimAmount, chain.symbol)}
              disabled={chain.needsFunding}
              isClaiming={
                !!activeClaimHistory.find(
                  (claim: ClaimReceipt) =>
                    claim.chain.pk === chain.pk &&
                    claim.status !== ClaimReceiptState.REJECTED,
                )
              }
              needsFunding={
                chain.needsFunding && chain.chainType !== ChainType.SOLANA
              }
              symbol={chain.symbol}
            />
          </div>
        </div>
      </div>
      <div
        className={`${
          isHighlighted ? "bg-g-primary-low" : "bg-bg04"
        } flex w-full flex-col items-center justify-center gap-4 rounded-b-3xl p-4 md:flex-row md:justify-between md:gap-0 md:p-0 md:px-4`}
      >
        <div
          className={`${
            isHighlighted ? "bg-transparent" : "bg-bg04"
          } flex w-28 items-center justify-between md:justify-start`}
        >
          <p className="chain-card__info__title text-sm text-gray90">
            Currency:{" "}
          </p>
          <p className="chain-card__info__value ml-1.5 text-sm text-gray100">
            {chain.symbol}
          </p>
        </div>

        <div
          className={`${
            isHighlighted ? "bg-transparent" : "bg-bg04"
          } flex h-12 w-32 items-center justify-between rounded-b-xl md:justify-start`}
        >
          <p className="chain-card__info__title text-sm text-gray90">
            Fuel Champion:{" "}
          </p>
          <p className="ml-1.5 text-sm font-normal text-gray100">
            {!!fuelChampionObj[chain.pk]
              ? `@${fuelChampionObj[chain.pk]}`
              : "--"}
          </p>
        </div>
        <Tooltip
          className={`mx-auto h-10 w-56 !cursor-default self-end rounded-b-2xl rounded-t-2xl px-3 py-3 text-sm md:mx-0 md:rounded-b-none ${
            isHighlighted ? "bg-transparent" : "bg-bg00"
          }`}
          withoutImage
          text={
            chain.isOneTimeClaim
              ? "You can only claim from this tap once."
              : "You can claim from this tap each round."
          }
        >
          {chain.isOneTimeClaim ? (
            <div className="flex items-center justify-between text-secondary-text md:justify-center">
              <p className="flex-1">Single-Claim Tap</p>
              <Icon
                className="text-white"
                iconSrc="/assets/images/gas-tap/claimable-once.svg"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-none text-gray100 md:justify-center">
              <p className="flex-1 text-[#689E7A]">Periodic Tap</p>
              <Icon
                className="text-[#689E7A]"
                iconSrc="/assets/images/gas-tap/periodic-tap.svg"
              />
            </div>
          )}
        </Tooltip>
        {/* <div
          className={`${
            isHighlighted ? "bg-transparent" : "bg-bg04"
          } flex w-32 items-center justify-between rounded-b-xl md:justify-end`}
        >
          <p className="text-sm text-gray90">Total Claims:</p>
          <p className="ml-1.5 text-sm text-gray100">
            {numberWithCommas(chain.totalClaims)}
          </p>
        </div> */}
        <div
          key={isThisRound ? 1 : 0}
          className={`${
            isHighlighted ? "bg-transparent" : "bg-bg04"
          } animate-fadeToggle flex w-32 items-center justify-between rounded-b-xl transition-opacity duration-300 ease-in-out`}
        >
          <p className="text-sm text-gray90">
            {isThisRound ? "This Round Claims" : "Total Claims"}
          </p>
          <p className="ml-1.5 font-mono text-sm text-white">
            {isThisRound
              ? numberWithCommas(chain.totalClaimsThisRound)
              : numberWithCommas(chain.totalClaims)}
          </p>
        </div>
        <div className={`flex w-44 items-center rounded-b-xl md:justify-end`}>
          <p
            className={`text-sm ${chain.currentFuelLevel > 6 ? "text-gray90" : chain.currentFuelLevel >= 4 ? "text-[#EBD14A]" : "text-[#F16E35]"} `}
          >
            Balance:
          </p>
          <GasBalanceRenderer balance={chain.currentFuelLevel} />
        </div>
      </div>
    </article>
  );
};

export default ChainCard;
