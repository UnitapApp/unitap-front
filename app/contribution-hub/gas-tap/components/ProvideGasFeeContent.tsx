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
  estimateGas,
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
  const balance = useWalletBalance({
    address,
    chainId: Number(selectedChain?.chainId),
  });

  const chainList = useMemo(() => {
    return originalChainList.filter(
      (chain) => chain.chainType !== ChainType.SOLANA
    );
  }, [originalChainList]);

  useEffect(() => {
    if (chainList.length > 0 && !selectedChain) {
      if (initialChainId) {
        const chain = chainList.find(
          (chain) => chain.pk === Number(initialChainId)
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

  const [fundAmount, setFundAmount] = useState<string>("");

  const [modalState, setModalState] = useState(false);
  const [fundTransactionError, setFundTransactionError] = useState("");
  const [txHash, setTxHash] = useState("");

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
        "Unexpected error. Could not estimate gas for this transaction."
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
          : parseEther(fundAmount)
      ),
    };

    setSubmittingFundTransaction(true);

    const estimatedGas = await estimateGas(provider, {
      from: address,
      to: "0xE6Bc2586fcC1Da738733867BFAf381B846AAe834",
      value: BigInt(tx.value),
    }).catch((err: any) => {
      return err;
    });

    console.log(estimateGas);

    if (typeof estimatedGas !== "bigint") {
      handleTransactionError(estimatedGas);
      setSubmittingFundTransaction(false);
      return;
    }

    signer
      ?.sendTransaction({
        ...tx,
        ...(estimatedGas ? { gasLimit: estimatedGas } : {}),
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
  }, [isRightChain, address, provider]);

  return (
    <div className="bg-gray20 select-none rounded-xl p-12 relative h-[10hv] overflow-hidden  text-white flex flex-col items-center text-center">
      <div className="animate-fadeIn">
        <div className="absolute top-[-10.5em] left-[-24.5em] z-0">
          <Icon iconSrc="/assets/images/fund/provide-gas-fee-planet.svg" />
        </div>
        <div className="z-10">
          <Icon iconSrc="/assets/images/provider-dashboard/gasTap/battery.png" />
        </div>
        <div className="w-full max-w-[452px] ">
          <div className="z-10 mt-5 flex flex-col items-center">
            <p className="text-sm font-semibold mb-2">Provide Gas Fee</p>
            <div className=" flex items-center">
              <p className="text-xs text-gray100 max-w-[300px]">
                100% of contributions will fund distributions and transaction
                costs of the gas tap.
              </p>
            </div>
          </div>

          <div className="select-box w-full mt-4 min-w-[452px]">
            <div
              className="select-box__token flex justify-between px-4 py-2 items-center h-[44px] rounded-[12px] w-full cursor-pointer bg-gray40 border border-gray50 hover:bg-gray60 mb-4"
              onClick={() => setModalState(true)}
            >
              {selectedChain ? (
                <div className="flex items-center gap-3">
                  <Icon
                    iconSrc={getChainIcon(selectedChain)}
                    width="24px"
                    height="24px"
                  />
                  <p className="select-box__info__coin-symbol text-white text-xs font-semibold">
                    {selectedChain?.symbol}
                  </p>
                </div>
              ) : (
                <span className="w-8 h-8 rounded-full bg-gray50"></span>
              )}
              <Icon
                iconSrc="/assets/images/fund/arrow-down.png"
                width="14px"
                height="auto"
              />
            </div>
            <div className="select-box__info w-full flex flex-col justify-between px-4 py-2 rounded-xl bg-gray40">
              <div className="select-box__info__amount w-full flex">
                <input
                  className="fund-input w-full text-sm bg-transparent text-white"
                  type="number"
                  step="0.001"
                  min="0"
                  autoFocus={true}
                  placeholder="Enter Amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
                <div
                  onClick={() => setFundAmount(balance.data?.formatted!)}
                  className="bg-gray20 select-not hover:bg-gray40 border border-gray100 text-gray100 text-xs flex items-center w-[52px] h-[28px] rounded-xl justify-center cursor-pointer"
                >
                  Max
                </div>
              </div>
            </div>
          </div>

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
            className="!w-full mt-5"
            onClick={handleSendFunds}
            disabled={!Number(fundAmount) && isRightChain && isConnected}
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
