import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { Chain, ChainType } from "@/types";
import { getChainIcon } from "@/utils/chain";
import { USER_DENIED_REQUEST_ERROR_CODE } from "@/utils/web3";
import { parseToLamports } from "@/utils/numbers";
import {
  useEstimateContractGas,
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
import { formatUnits, parseEther } from "viem";
import { useGlobalContext } from "@/context/globalProvider";
import Image from "next/image";
import Tooltip from "@/components/ui/Tooltip";

const Content: FC<{ initialChainId?: number }> = ({ initialChainId }) => {
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

  const balance = useWalletBalance({
    address,
    chainId: Number(selectedChain?.chainId),
  });

  const { data, isLoading } = useEstimateContractGas({
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

    if (!data) return;

    // let estimatedGas: bigint | undefined = data;

    // if (typeof estimatedGas !== "bigint") {
    //   handleTransactionError(estimatedGas);
    //   setSubmittingFundTransaction(false);
    //   return;
    // }

    signer
      ?.sendTransaction({
        ...tx,
        // ...(estimatedGas ? { gasLimit: estimatedGas } : {}),
        // gasPrice
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
      return "Pending...";
    }
    return !isRightChain ? "Switch Network" : "Submit Contribution";
  }, [isConnected, isRightChain, loading]);

  useEffect(() => {
    balance.refetch();
  }, [isRightChain, address, provider, balance]);

  const helpAmount =
    fundAmount && selectedChain
      ? Math.floor(
          (Number(fundAmount) * 0.75) /
            (selectedChain?.maxClaimAmount / 10 ** selectedChain.decimals),
        )
      : 0;

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
      {!!fundTransactionError || !!txHash ? (
        <FundTransactionModal
          fundAmount={fundAmount}
          closeModalHandler={closeModalHandler}
          provideGasFeeError={fundTransactionError}
          txHash={txHash}
          selectedChain={selectedChain}
        />
      ) : (
        <div className="z-0 rounded-xl px-4 py-6">
          <Image
            width={661}
            height={665}
            alt="gas fee planet"
            src="/assets/images/fund/provide-gas-fee-planet.svg"
            className="absolute -left-64 -top-16 -z-10 scale-150"
          />
          <p className="z-1 mb-3 text-xl font-bold text-white">
            Contribute Gas
          </p>
          <p className="z-1 mb-3 text-xs text-gray100">
            100% of contributions will fund distributions and transaction costs
            of the gas tap.
          </p>
          {!userToken && (
            <p className="z-1 mb-3 text-xs text-warn">
              You must login in order for your contribution to be counted in
              leaderboard
            </p>
          )}

          <div className="select-box mb-2 mt-5 flex w-full overflow-hidden rounded-xl bg-gray40">
            <div
              className="select-box__token duration-50 flex h-16 w-24 cursor-pointer items-center justify-evenly bg-gray30 transition-all hover:bg-gray60"
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
                <span className="h-8 w-8 rounded-full bg-gray50"></span>
              )}
              <Icon
                iconSrc="/assets/images/fund/arrow-down.png"
                width="14px"
                height="auto"
              />
            </div>
            <div className="select-box__info my-2 ml-3 mr-4 flex w-full flex-col justify-between bg-gray40">
              <div className="select-box__info__top flex w-full items-center justify-between">
                <p className="select-box__info__coin-symbol text-xs font-semibold text-white">
                  {selectedChain?.symbol}
                </p>
                {(balance.isLoading && (balance.data as any)?.formatted) || (
                  <p
                    // onClick={() => setFundAmount(balance.toString())}
                    className="select-box__info__coin-balance text-xs font-semibold text-gray100"
                  >
                    Balance:{" "}
                    {(balance.data
                      ? formatUnits(balance.data.value, balance.data.decimals)
                      : "...") +
                      " " +
                      selectedChain?.symbol}{" "}
                  </p>
                )}
              </div>
              <div className="select-box__info__amount w-full">
                <input
                  className="fund-input w-full bg-transparent text-xl text-white"
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
          {!!fundAmount && !!helpAmount && (
            <div className="ml-5 mt-2 text-sm text-gray90">
              You will help onboard{" "}
              <Tooltip
                text="75% of your donation will be distributed among users. the rest is used for transaction fees. and depending on the network gas fees, the number might not be exact."
                toolTipClassName="!w-[300px]"
                className="cursor-pointer"
                // title=""
              >
                <b>approximately</b>
              </Tooltip>{" "}
              <span className="text-green-500">{helpAmount}</span> users to this
              network!
            </div>
          )}

          <ClaimButton
            height="3.5rem"
            className="mt-5 !w-full text-white"
            $fontSize="20px"
            onClick={handleSendFunds}
            disabled={
              (!Number(fundAmount) && isRightChain && isConnected) || isLoading
            }
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
            <p className="z-1 mb-3 text-xl font-bold text-white">
              Contribute Gas
            </p>
            <p className="z-1 mb-3 text-xs text-gray100">
              100% of contributions will fund distributions and transaction
              costs of the gas tap.
            </p>
            {!userToken && (
              <p className="z-1 mb-3 text-xs text-warn">
                You must login in order for your contribution to be counted in
                leaderboard
              </p>
            )}

            <div className="select-box mb-2 mt-5 flex w-full overflow-hidden rounded-xl bg-gray40">
              <div
                className="select-box__token duration-50 flex h-16 w-24 cursor-pointer items-center justify-evenly bg-gray30 transition-all hover:bg-gray60"
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
                  <span className="h-8 w-8 rounded-full bg-gray50"></span>
                )}
                <Icon
                  iconSrc="/assets/images/fund/arrow-down.png"
                  width="14px"
                  height="auto"
                />
              </div>
              <div className="select-box__info my-2 ml-3 mr-4 flex w-full flex-col justify-between bg-gray40">
                <div className="select-box__info__top flex w-full items-center justify-between">
                  <p className="select-box__info__coin-symbol text-xs font-semibold text-white">
                    {selectedChain?.symbol}
                  </p>
                  {(balance.isLoading && (balance.data as any)?.formatted) || (
                    <p
                      // onClick={() => setFundAmount(balance.toString())}
                      className="select-box__info__coin-balance text-xs font-semibold text-gray100"
                    >
                      Balance:{" "}
                      {balance.data
                        ? formatUnits(
                            balance.data?.value,
                            balance.data.decimals,
                          ).slice(0, 5)
                        : "..."}{" "}
                      {selectedChain?.symbol}{" "}
                    </p>
                  )}
                </div>
                <div className="select-box__info__amount w-full">
                  <input
                    className="fund-input w-full bg-transparent text-xl text-white"
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
            {!!fundAmount && !!helpAmount && (
              <div className="ml-5 mt-2 text-sm text-gray90">
                You will help onboard{" "}
                <Tooltip
                  text="All of your contributions will go to onboarding users to this network. The majority of the donations will be transferred straight to users as gas tokens and a smaller part will cover the network transaction fees."
                  toolTipClassName="!w-[300px]"
                  className="cursor-pointer"
                  // title=""
                >
                  <b>approximately</b>
                </Tooltip>{" "}
                <span className="text-green-500">{helpAmount}</span> users to
                this network!
              </div>
            )}

            <ClaimButton
              height="3.5rem"
              className="mt-5 !w-full text-white"
              $fontSize="20px"
              onClick={handleSendFunds}
              disabled={!Number(fundAmount) && isRightChain && isConnected}
              data-testid="fund-action"
            >
              {fundActionButtonLabel}
            </ClaimButton>
          </Modal>
        </div>
      )}
    </div>
  );
};

const TooltipContent = () => {};

export default Content;
