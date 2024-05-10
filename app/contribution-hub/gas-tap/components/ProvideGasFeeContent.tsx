"use client";

import FundTransactionModal from "@/app/gastap/components/Modals/FundTransactionModal";
import SelectChainModal from "@/app/gastap/components/Modals/SelectChainModal";
import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal/modal";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { Chain, ChainType } from "@/types/gastap";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { parseToLamports } from "@/utils/numbers";
import { parseEther } from "viem";
import { submitDonationTxHash } from "@/utils/api";
import {
  useEstimateContractGas,
  useNetworkSwitcher,
  useWalletAccount,
  useWalletBalance,
  useWalletNetwork,
  useWalletProvider,
  useWalletSigner,
} from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";
import { USER_DENIED_REQUEST_ERROR_CODE } from "@/utils/web3";
import { getChainIcon } from "@/utils/chain";
import Link from "next/link";
import RoutePath from "@/utils/routes";
import Tooltip from "@/components/ui/Tooltip";

const ProvideGasFeeContent: FC<{ initialChainId?: number }> = ({
  initialChainId,
}) => {
  const { chainList: originalChainList } = useGasTapContext();

  const { userToken } = useUserProfileContext();
  const { isConnected, address } = useWalletAccount();
  const provider = useWalletProvider();
  const signer = useWalletSigner();
  const { chain } = useWalletNetwork();
  const chainId = chain?.id;

  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [fundAmount, setFundAmount] = useState<string>("");

  const [modalState, setModalState] = useState(false);
  const [fundTransactionError, setFundTransactionError] = useState("");
  const [txHash, setTxHash] = useState("");

  const helpAmount =
    fundAmount && selectedChain
      ? Math.floor(
          (Number(fundAmount) * 0.75) /
            (selectedChain?.maxClaimAmount / 10 ** selectedChain.decimals),
        )
      : 0;

  const balance = useWalletBalance({
    address,
    chainId: Number(selectedChain?.chainId),
  });

  const { isLoading, data } = useEstimateContractGas({
    chainId,
    amount: parseEther(fundAmount),
    to: "0xE6Bc2586fcC1Da738733867BFAf381B846AAe834",
  });

  const chainList = useMemo(() => {
    return originalChainList.filter(
      (chain) => chain.chainType !== ChainType.SOLANA,
    );
  }, [originalChainList]);

  useEffect(() => {
    if (chainList.length > 0 && !selectedChain) {
      if (initialChainId) {
        const chain = chainList.find(
          (chain) => chain.pk === Number(initialChainId),
        );
        if (chain) {
          setSelectedChain(chain);
        }
      } else {
        setSelectedChain(chainList[0]);
      }
    }
  }, [chainList, initialChainId, selectedChain]);

  const { switchChain } = useNetworkSwitcher();

  const isRightChain = useMemo(() => {
    if (!isConnected || !chainId || !selectedChain) return false;
    return chainId === Number(selectedChain.chainId);
  }, [selectedChain, isConnected, chainId]);

  const { setIsWalletPromptOpen } = useGlobalContext();

  const handleTransactionError = useCallback((error: any) => {
    if (error?.code === USER_DENIED_REQUEST_ERROR_CODE) return;
    const message = error?.data?.message || error?.error?.message;
    if (message) {
      if (message.includes("insufficient funds")) {
        setFundTransactionError("Error: Insufficient Funds");
      } else {
        setFundTransactionError(message);
      }
    } else {
      setFundTransactionError(
        "Unexpected error. Could not estimate gas for this transaction.",
      );
    }
  }, []);

  useEffect(() => {
    setFundAmount("");
  }, [chainId]);

  const [submittingFundTransaction, setSubmittingFundTransaction] =
    useState(false);

  const loading = useMemo(() => {
    if (submittingFundTransaction) return true;
    if (!isConnected) return false;
    return !chainId || !selectedChain || !address;
  }, [address, isConnected, chainId, selectedChain, submittingFundTransaction]);

  const handleSendFunds = useCallback(async () => {
    if (!isConnected) {
      setIsWalletPromptOpen(true);
      return;
    }
    if (!chainId || !selectedChain || !address || loading) return;
    if (!isRightChain) {
      await switchChain(Number(selectedChain.chainId));
      return;
    }
    if (!Number(fundAmount)) {
      alert("Enter fund amount");
      return;
    }

    if (!provider) return;

    const chainPk = selectedChain.pk;

    let tx = {
      to: "0xE6Bc2586fcC1Da738733867BFAf381B846AAe834" as any,
      value: BigInt(
        selectedChain.symbol === "SOL"
          ? parseToLamports(fundAmount)
          : parseEther(fundAmount),
      ),
    };

    setSubmittingFundTransaction(true);

    // let estimatedGas = data!;

    // if (typeof estimatedGas !== "bigint") {
    //   handleTransactionError(estimatedGas);
    //   setSubmittingFundTransaction(false);
    //   return;
    // }

    signer
      ?.sendTransaction({
        ...tx,
        // ...(estimatedGas ? { gasLimit: estimatedGas } : {}),
        // gasPrice /// TODO add gasPrice based on EIP 1559
      })
      .then(async (tx) => {
        await provider.waitForTransactionReceipt({
          hash: tx,
          confirmations: 1,
        });
        return tx;
      })
      .then(async (tx) => {
        if (userToken) await submitDonationTxHash(tx, chainPk, userToken);
        setTxHash(tx);
      })
      .catch((err) => {
        handleTransactionError(err);
      })
      .finally(() => {
        setSubmittingFundTransaction(false);
      });
  }, [
    isConnected,
    chainId,
    selectedChain,
    address,
    loading,
    isRightChain,
    fundAmount,
    provider,
    data,
    signer,
    setIsWalletPromptOpen,
    switchChain,
    handleTransactionError,
    userToken,
  ]);

  const closeModalHandler = () => {
    setFundTransactionError("");
    setTxHash("");
    setModalState(false);
  };

  const fundActionButtonLabel = useMemo(() => {
    if (!isConnected) {
      return "Connect Wallet";
    }
    if (loading) {
      return "Loading...";
    }
    return !isRightChain ? "Switch Network" : "Submit Contribution";
  }, [isConnected, isRightChain, loading]);

  useEffect(() => {
    balance.refetch();
  }, [isRightChain, address, provider, balance]);

  return (
    <div className="relative flex h-[10hv] select-none flex-col items-center overflow-hidden  rounded-xl bg-gray20 p-12 text-center text-white">
      <div className="w-full max-w-[452px] animate-fadeIn">
        <div className="absolute left-[-24.5em] top-[-10.5em] z-0">
          <Icon iconSrc="/assets/images/fund/provide-gas-fee-planet.svg" />
        </div>
        <div className="absolute top-2 cursor-pointer">
          <Link href={RoutePath.PROVIDER_GASTAP}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.84756 6.22275C10.1388 6.51734 10.136 6.99221 9.84141 7.2834L4.81687 12.25L9.84141 17.2166C10.136 17.5078 10.1388 17.9827 9.84756 18.2772C9.55637 18.5718 9.08151 18.5746 8.78692 18.2834L3.22275 12.7834C3.08022 12.6425 3 12.4504 3 12.25C3 12.0496 3.08022 11.8575 3.22275 11.7166L8.78692 6.2166C9.08151 5.92541 9.55637 5.92817 9.84756 6.22275Z"
                fill="#67677B"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.15625 12.25C3.15625 11.8358 3.49204 11.5 3.90625 11.5H19.3338C19.748 11.5 20.0837 11.8358 20.0837 12.25C20.0837 12.6642 19.748 13 19.3338 13H3.90625C3.49204 13 3.15625 12.6642 3.15625 12.25Z"
                fill="#67677B"
              />
            </svg>
          </Link>
        </div>
        <div className="z-10">
          <Icon iconSrc="/assets/images/provider-dashboard/gasTap/battery.png" />
        </div>
        <div className="w-full max-w-[452px] ">
          <div className="z-10 mt-5 flex flex-col items-center">
            <p className="mb-2 text-sm font-semibold">
              Onboard new users by providing gas
            </p>
            <div className=" flex items-center">
              <p className="max-w-[300px] text-xs text-gray100">
                100% of contributions will fund distributions and transaction
                costs of the gas tap.
              </p>
            </div>
          </div>

          <div className="select-box mt-4 w-full">
            <div
              className="select-box__token mb-4 flex h-[44px] w-full cursor-pointer items-center justify-between rounded-[12px] border border-gray50 bg-gray40 px-4 py-2 hover:bg-gray60"
              onClick={() => setModalState(true)}
            >
              {selectedChain ? (
                <div className="flex items-center gap-3">
                  <Icon
                    iconSrc={getChainIcon(selectedChain)}
                    width="24px"
                    height="24px"
                  />
                  <p className="select-box__info__coin-symbol text-xs font-semibold text-white">
                    {selectedChain?.symbol}
                  </p>
                </div>
              ) : (
                <span className="h-8 w-8 rounded-full bg-gray50"></span>
              )}
              <Icon
                iconSrc="/assets/images/fund/arrow-down.png"
                width="14px"
                height="auto"
              />
            </div>
            <div className="select-box__info relative flex w-full flex-col rounded-xl bg-gray40 pl-4 ">
              <div className="select-box__info__amount flex h-[43px] w-full items-center  justify-center">
                <input
                  className="fund-input w-full bg-transparent text-sm text-white"
                  type="number"
                  step="0.001"
                  min="0"
                  autoFocus={true}
                  placeholder="Enter Amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
                <div className="flex h-[100%] w-[130px] items-center justify-center rounded-br-xl rounded-tr-xl bg-gray30 text-center text-xs font-medium leading-4 text-gray90">
                  Balance{" "}
                  {balance.data?.formatted && (
                    <span className="ml-1 text-space-green">
                      {Number.parseFloat(balance.data?.formatted).toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
              {Number(balance.data?.formatted) < Number(fundAmount) && (
                <p className="absolute -bottom-4 left-0 text-2xs text-error">
                  Insufficient Balance
                </p>
              )}
            </div>
          </div>

          {!!fundAmount && !!helpAmount && (
            <div className="mt-4 flex min-h-[31px] items-center justify-between rounded-lg border border-gray50 px-2 text-xs  text-gray90 ">
              <div>
                You will help onboard approximately
                <span className="mx-1 text-gray100">{helpAmount}</span> users to
                this network!
              </div>
              <Tooltip
                text="All of your contributions will go to onboarding users to this network. The majority of the donations will be transferred straight to users as gas tokens and a smaller part will cover the network transaction fees."
                toolTipClassName="!w-[300px]"
                className="mr-2 cursor-pointer"
                // title=""
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.00004 13.6666C11.1144 13.6666 13.6667 11.1144 13.6667 7.99998C13.6667 4.8856 11.1144 2.33331 8.00004 2.33331C4.88566 2.33331 2.33337 4.8856 2.33337 7.99998C2.33337 11.1144 4.88566 13.6666 8.00004 13.6666ZM14.6667 7.99998C14.6667 11.6666 11.6667 14.6666 8.00004 14.6666C4.33337 14.6666 1.33337 11.6666 1.33337 7.99998C1.33337 4.33331 4.33337 1.33331 8.00004 1.33331C11.6667 1.33331 14.6667 4.33331 14.6667 7.99998Z"
                    fill="#67677B"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.2 7.16669C8.36569 7.16669 8.5 7.301 8.5 7.46669V11.2C8.5 11.3657 8.36569 11.5 8.2 11.5H7.8C7.63431 11.5 7.5 11.3657 7.5 11.2V7.46669C7.5 7.301 7.63431 7.16669 7.8 7.16669H8.2Z"
                    fill="#67677B"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.49634 5.13331C7.49634 4.96763 7.63065 4.83331 7.79634 4.83331H8.20233C8.36801 4.83331 8.50233 4.96763 8.50233 5.13331V5.53331C8.50233 5.699 8.36801 5.83331 8.20233 5.83331H7.79634C7.63065 5.83331 7.49634 5.699 7.49634 5.53331V5.13331Z"
                    fill="#67677B"
                  />
                </svg>
              </Tooltip>
            </div>
          )}
          <Modal
            titleLeft="Select Chain"
            isOpen={modalState}
            size="medium"
            closeModalHandler={closeModalHandler}
          >
            <SelectChainModal
              closeModalHandler={closeModalHandler}
              selectedChain={selectedChain}
              setSelectedChain={setSelectedChain}
            ></SelectChainModal>
          </Modal>

          <ClaimButton
            height="3.5rem"
            className="mt-5 !w-full"
            onClick={handleSendFunds}
            disabled={
              (!Number(fundAmount) && isRightChain && isConnected) ||
              Number(balance.data?.formatted) < Number(fundAmount)
            }
            data-testid="fund-action"
          >
            {fundActionButtonLabel}
          </ClaimButton>

          <Modal
            title="Provide Gas Fee"
            isOpen={!!fundTransactionError || !!txHash}
            closeModalHandler={closeModalHandler}
          >
            <FundTransactionModal
              fundAmount={fundAmount}
              closeModalHandler={closeModalHandler}
              provideGasFeeError={fundTransactionError}
              txHash={txHash}
              selectedChain={selectedChain}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProvideGasFeeContent;
