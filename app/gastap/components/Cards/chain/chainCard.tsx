"use client";

import ClaimButton from "./claimButton";
import { useGasTapContext } from "@/context/gasTapProvider";
import { PK, ClaimReceipt, ClaimReceiptState, ChainType, Chain } from "@/types";
import { formatChainBalance, numberWithCommas } from "@/utils";
import { getChainIcon } from "@/utils/chain";
import { useNetworkSwitcher, useWalletAccount } from "@/utils/wallet";
import { FC, MouseEventHandler, ReactNode, useContext, useMemo } from "react";
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
  link?: string;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ icon, label, link, children, onClick }) => {
  if (onClick || !link) {
    return (
      <button
        onClick={onClick}
        className="group ml-2 flex h-6 items-center overflow-hidden rounded-xl border border-bg04 bg-bg02 px-3 py-1 text-2xs text-gray100 transition-all hover:bg-bg05"
      >
        <Icon iconSrc={icon} alt="network" />
        <div className="invisible flex w-0 items-center gap-4 whitespace-nowrap opacity-0 transition-all group-hover:visible group-hover:ml-2 group-hover:w-20 group-hover:opacity-100">
          <span className="w-full">{label}</span>
          {children}
        </div>
      </button>
    );
  }
  return (
    <Link
      href={link}
      target="_blank"
      className="group ml-2 flex h-6 items-center overflow-hidden rounded-xl border border-bg04 bg-bg02 px-3 py-1 text-2xs text-gray100 transition-all hover:bg-bg05"
    >
      <Icon iconSrc={icon} alt="network" />
      <div className="invisible flex w-0 items-center gap-4 transition-all group-hover:visible group-hover:ml-4 group-hover:w-16">
        <span className="">{label}</span>
        {children}
      </div>
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
      } chain-clip relative flex w-full flex-col items-center justify-center overflow-visible rounded-3xl border border-bg04`}
    >
      <div
        className={`w-full border-2 border-bg03 pb-4 pl-3 pr-6 pt-4 ${
          isHighlighted ? "bg-g-primary-low" : "bg-bg02"
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
              >
                <Image
                  alt="link"
                  height={12}
                  width={12}
                  src="/assets/images/gas-tap/external-link.svg"
                />
              </ExpandableLink>

              {chain.chainType === "EVM" && (
                <ExpandableLink
                  icon="/icons/plus.svg"
                  disabled={!isConnected}
                  onClick={() => addAndSwitchChain(chain)}
                  label="Add To Wallet"
                />
              )}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <p className="rounded-lg border border-bg04 px-2 py-1 text-2xs text-gray100">
                {chain.isTestnet ? "Testnet" : "Mainnet"}
              </p>
              <p className="ml-2 rounded-lg border border-bg04 px-2 py-1 text-2xs text-gray100">
                {chain.chainType}
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
                className={`refuel-button relative mr-4 min-w-16 rounded-3xl p-[2px] text-sm font-semibold ${
                  isChainRefuelFine ? "refuel-fine" : ""
                }`}
              >
                <div className="text-second-white flex h-11 items-center justify-center gap-4 rounded-3xl p-2 px-4">
                  {isChainRefuelFine || <p>Refuel</p>}
                  <Image
                    src="/assets/images/gas-tap/refuel-logo.svg"
                    width={16}
                    height={20}
                    alt="refuel"
                  />
                </div>
              </button>
            )}

            <ClaimButton
              gasIcon={chain.gasImageUrl}
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
          isHighlighted ? "bg-g-primary-low" : "bg-bg03"
        } flex w-full flex-col items-center justify-center gap-4 rounded-b-3xl p-4 md:flex-row md:justify-between md:gap-0 md:p-0 md:px-4`}
      >
        <div
          className={` flex w-28 items-center justify-between md:justify-start`}
        >
          <p className="chain-card__info__title text-sm text-gray90">
            Currency:{" "}
          </p>
          <p className="chain-card__info__value ml-1.5 text-sm text-gray100">
            {chain.symbol}
          </p>
        </div>

        <div
          className={`flex h-12 w-32 items-center justify-between rounded-b-xl md:justify-start`}
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
          className={`mx-auto w-56 !cursor-default bg-bg04 px-3 py-3 text-sm md:mx-0`}
          withoutImage
          text={
            chain.isOneTimeClaim
              ? "You can only claim from this tap once."
              : "You can claim from this tap each round."
          }
        >
          {chain.isOneTimeClaim ? (
            <div className="flex items-center justify-between text-secondary-text md:justify-center">
              <p className="flex-1 font-semibold">Single-Claim Tap</p>
              <Icon
                className="text-white"
                iconSrc="/assets/images/gas-tap/claimable-once.svg"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-none text-gray100 md:justify-center">
              <p className="flex-1 font-semibold text-[#689E7A]">
                Periodic Tap
              </p>
              <Icon
                className="text-[#689E7A]"
                iconSrc="/assets/images/gas-tap/periodic-tap.svg"
              />
            </div>
          )}
        </Tooltip>

        <div
          key={isThisRound ? 1 : 0}
          className={` animate-fadeToggle flex w-32 items-center justify-between rounded-b-xl transition-opacity duration-300 ease-in-out`}
        >
          <p className="text-sm text-gray90">
            {isThisRound ? "Round Claims" : "Total Claims"}
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
