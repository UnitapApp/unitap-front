import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { Chain, ChainType } from "@/types";
import { getChainIcon } from "@/utils/chain";
import { USER_DENIED_REQUEST_ERROR_CODE } from "@/utils/web3";
import { parseToLamports } from "@/utils/numbers";
import {
  estimateGas,
  useNetworkSwitcher,
  useWalletAccount,
  useWalletBalance,
  useWalletNetwork,
  useWalletProvider,
  useWalletSigner,
} from "@/utils/wallet";

import { useUserProfileContext } from "@/context/userProfile";
import { useGasTapContext } from "@/context/gasTapProvider";
import Modal from "@/components/ui/Modal/modal";
import { submitDonationTxHash } from "@/utils/api";
import SelectChainModal from "../SelectChainModal";
import FundTransactionModal from "../FundTransactionModal";
import { parseEther } from "viem";
import { useGlobalContext } from "@/context/globalProvider";
import Image from "next/image";

const Content: FC<{ initialChainId?: number }> = ({ initialChainId }) => {
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
  }, [isRightChain, address, provider, balance]);

  return (
    <div className="flex justify-center">
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
      <div className="rounded-xl py-6 px-4 z-0">
        <Image
          width={661}
          height={665}
          alt="gas fee planet"
          src="/assets/images/fund/provide-gas-fee-planet.svg"
          className="absolute -left-64 -top-16 scale-150 -z-10"
        />
        <span className="z-100 w-full">
          <Icon
            className="mb-2"
            iconSrc="./assets/images/fund/provide-gas-fee-battery.svg"
            width="146px"
            height="auto"
            alt="gas fee battery"
          />
          <p className="text-white font-bold text-xl mb-3 z-1">
            Contribute Gas
          </p>
          <p className="text-gray100 text-xs mb-3 z-1">
            100% of contributions will fund distributions and transaction costs
            of the gas tap.
          </p>
          {!userToken && (
            <p className="text-warn text-xs mb-3 z-1">
              You must login in order for your contribution to be counted in
              leaderboard
            </p>
          )}

          <div className="select-box w-full flex rounded-xl overflow-hidden mt-5 mb-2 bg-gray40">
            <div
              className="select-box__token flex justify-evenly items-center w-24 h-16 cursor-pointer transition-all duration-50 bg-gray30 hover:bg-gray60"
              onClick={() => setModalState(true)}
            >
              {selectedChain ? (
                <Icon
                  alt={selectedChain.chainName}
                  iconSrc={getChainIcon(selectedChain)}
                  width="auto"
                  height="32px"
                />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gray50"></span>
              )}
              <Icon
                iconSrc="assets/images/fund/arrow-down.png"
                width="14px"
                height="auto"
              />
            </div>
            <div className="select-box__info w-full flex flex-col justify-between my-2 ml-3 mr-4 bg-gray40">
              <div className="select-box__info__top w-full flex items-center justify-between">
                <p className="select-box__info__coin-symbol text-white text-xs font-semibold">
                  {selectedChain?.symbol}
                </p>
                {(balance.isLoading && balance.data?.formatted) || (
                  <p
                    // onClick={() => setFundAmount(balance.toString())}
                    className="select-box__info__coin-balance text-gray100 text-xs font-semibold"
                  >
                    Balance:{" "}
                    {balance.data?.formatted.slice(0, 5) +
                      " " +
                      selectedChain?.symbol}{" "}
                  </p>
                )}
              </div>
              <div className="select-box__info__amount w-full">
                <input
                  className="fund-input w-full text-xl bg-transparent text-white"
                  type="number"
                  step="0.001"
                  min="0"
                  autoFocus={true}
                  placeholder="Enter Amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <ClaimButton
            height="3.5rem"
            className="!w-full text-white mt-5"
            $fontSize="20px"
            onClick={handleSendFunds}
            disabled={!Number(fundAmount) && isRightChain && isConnected}
            data-testid="fund-action"
          >
            {fundActionButtonLabel}
          </ClaimButton>
          <Modal
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
        </span>
      </div>
    </div>
  );
};

export default Content;
