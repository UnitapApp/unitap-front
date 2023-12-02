"use client";

import {
  SecondaryButton,
  ClaimedButton,
  ClaimButton,
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
  const { openClaimModal, activeClaimHistory, oneTimeClaimedGasList } =
    useGasTapContext();

  const isOneTimeCollected = useMemo(
    () => !!oneTimeClaimedGasList.find((item) => item.chain.pk === chain.pk),
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
        } rounded-xl flex flex-col items-center justify-center w-full`}
      >
        <div
          className={`pt-4 pr-6 pb-4 pl-3 w-full ${
            isHighlighted ? "bg-g-primary-low" : "bg-gray20"
          } flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center rounded-t-xl`}
        >
          <div
            onClick={() => window.open(chain.blockScanAddress, "_blank")}
            className="hover:cursor-pointer items-center flex mb-6 sm:mb-0"
          >
            <span className="chain-logo-container w-10 h-10 flex justify-center">
              <img
                className="chain-logo w-auto h-[100%]"
                src={getChainIcon(chain)}
                alt="polygon logo"
              />
            </span>
            <p
              className=" text-white ml-3 text-center sm:text-left"
              data-testid={`chain-name-${chain.pk}`}
            >
              {chain.chainName}
            </p>
            <img
              className="arrow-icon mt-1 ml-1.5 w-2 h-2"
              src="assets/images/arrow-icon.svg"
              alt="arrow"
            />
            <p className="text-gray ml-2 text-2xs px-2 py-1 rounded bg-gray30">
              {chain.chainType}
            </p>
            <p className="text-gray ml-2 text-2xs px-2 py-1 rounded bg-gray30">
              {chain.isTestnet ? "Testnet" : "Mainnet"}
            </p>
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
                <ClaimedButton
                  data-testid={`chain-claimed-${chain.pk}`}
                  $mlAuto
                  $icon="../assets/images/claim/claimedIcon.svg"
                  $iconWidth={24}
                  $iconHeight={20}
                  onClick={() => openClaimModal(chain.pk)}
                  className="text-sm bg-g-primary-low border-2 border-space-green m-auto"
                >
                  <p className="text-gradient-primary flex-[2] font-semibold text-sm">
                    Claimed!
                  </p>
                </ClaimedButton>
              ) : chain.needsFunding && chain.chainType !== ChainType.SOLANA ? (
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
                  className="text-sm m-auto"
                >
                  <p>{`Claim ${formatChainBalance(
                    BigInt(chain.maxClaimAmount),
                    chain.symbol
                  )} ${chain.symbol}`}</p>
                </ClaimButton>
              ) : (
                <ClaimButton
                  data-testid={`chain-show-claim-${chain.pk}`}
                  $mlAuto
                  onClick={() => openClaimModal(chain.pk)}
                  className="text-sm m-auto"
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
          } w-full gap-2 md:gap-0 items-center flex flex-col md:flex-row rounded-b-xl px-8 justify-between`}
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
              isHighlighted ? "bg-transparent" : "bg-gray40"
            } w-full max-w-[180px] items-center flex rounded-none py-3 justify-between md:justify-center`}
          >
            {chain.isOneTimeClaim ? (
              <>
                <p className="text-xs">Single-Claim Tap</p>
                <Icon
                  className="text-white"
                  ml={4}
                  iconSrc="/assets/images/gas-tap/claimable-once.svg"
                />
              </>
            ) : (
              <>
                <p className="text-xs">Periodic Tap</p>
                <Icon
                  className="text-white"
                  ml={4}
                  iconSrc="/assets/images/gas-tap/periodic-tap.svg"
                />
              </>
            )}
          </div>

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
