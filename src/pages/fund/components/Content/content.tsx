import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ClaimButton, PrimaryButton } from "components/basic/Button/button";
import { ContentCard } from "./content.style";
import Icon from "components/basic/Icon/Icon";
import Input from "components/basic/Input/input";
import Dropdown from "components/basic/Dropdown/dropdown";
import { ClaimContext } from "../../../../hooks/useChainList";
import { Chain } from "../../../../types";
import { parseEther } from "@ethersproject/units";
import Modal from "components/common/Modal/modal";
import SelectChainModal from "../SelectChainModal/selectChainModal";
import FundTransactionModal from "../FundTransactionModal/FundTransactionModal";
import { getChainIcon } from "../../../../utils";
import { calculateGasMargin, USER_DENIED_REQUEST_ERROR_CODE } from "../../../../utils/web3";
import useWalletActivation from "../../../../hooks/useWalletActivation";
import useSelectChain from "../../../../hooks/useSelectChain";
import { useWeb3React } from "@web3-react/core";

const Content: FC = () => {
  const { chainList } = useContext(ClaimContext);
  const { chainId, provider, account } = useWeb3React();
  const active = !!account;
  const { tryActivation } = useWalletActivation();

  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  useEffect(() => {
    if (chainList.length > 0 && !selectedChain) {
      setSelectedChain(chainList[0]);
    }
  }, [chainList, selectedChain]);

  const addAndSwitchToChain = useSelectChain();

  const [fundAmount, setFundAmount] = useState<string>("");

  const [modalState, setModalState] = useState(false);
  const [fundTransactionError, setFundTransactionError] = useState("");
  const [txHash, setTxHash] = useState("");
  const isRightChain = useMemo(() => {
    if (!active || !chainId || !selectedChain) return false;
    return chainId === Number(selectedChain.chainId);
  }, [selectedChain, active, chainId]);

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
      setFundTransactionError("Unexpected error. Could not estimate gas for this transaction.");
    }
  }, []);

  const [submittingFundTransaction, setSubmittingFundTransaction] = useState(false);

  const loading = useMemo(() => {
    if (submittingFundTransaction) return true;
    if (!active) return false;
    return !chainId || !selectedChain || !account;
  }, [account, active, chainId, selectedChain, submittingFundTransaction]);

  const handleSendFunds = useCallback(async () => {
    if (!active) {
      await tryActivation();
      return;
    }
    if (!chainId || !selectedChain || !account || loading) return;
    if (!isRightChain) {
      await addAndSwitchToChain(selectedChain);
      return;
    }
    if (!Number(fundAmount)) {
      alert("Enter fund amount");
      return;
    }
    if (!provider) return;
    const tx = {
      from: account,
      to: selectedChain.fundManagerAddress,
      value: parseEther(fundAmount)
    };
    setSubmittingFundTransaction(true);
    const estimatedGas = await provider.estimateGas(tx).catch((err: any) => {
      return err;
    });

    if ("error" in estimatedGas || "code" in estimatedGas) {
      handleTransactionError(estimatedGas);
      setSubmittingFundTransaction(false);
      return;
    }

    provider
      .getSigner()
      .sendTransaction({
        ...tx,
        ...(estimatedGas ? { gasLimit: calculateGasMargin(estimatedGas) } : {})
        // gasPrice /// TODO add gasPrice based on EIP 1559
      })
      .then((tx) => {
        setTxHash(tx.hash);
      })
      .catch((err) => {
        handleTransactionError(err);
      })
      .finally(() => {
        setSubmittingFundTransaction(false);
      });
  }, [
    active,
    chainId,
    selectedChain,
    account,
    loading,
    isRightChain,
    fundAmount,
    provider,
    tryActivation,
    addAndSwitchToChain,
    handleTransactionError
  ]);

  const closeModalHandler = () => {
    setFundTransactionError("");
    setTxHash("");
    setModalState(false);
  };

  const fundActionButtonLabel = useMemo(() => {
    if (!active) {
      return "Connect Wallet";
    }
    if (loading) {
      return "Loading...";
    }
    return !isRightChain ? "Switch Network" : "Submit Contribution";
  }, [active, isRightChain, loading]);

  return (
    <div className="content-wrapper flex justify-center">
      <ContentCard className="bg-gray20 rounded-xl py-6 px-4 z-0">
        <img src="./assets/images/fund/provide-gas-fee-planet.svg" className="absolute -left-64 -top-16 scale-150 z-10" />
        <span className="z-100">
          <p className="mt-[185px] text-white font-bold text-xl mb-3 z-1">Provide Gas Fee</p>
          <p className="text-gray100 text-xs mb-3 z-1">
            99% of contributions will be distributed via the tap.
          </p>
          <p className="text-gray100 text-xs z-1">
            1% of contributions will fund Unitap development.
          </p>
          {selectedChain && (
            <Dropdown
              data-testid="fund-chain-dropdown"
              onClick={() => {
                setModalState(true);
              }}
              label="Chain"
              value={selectedChain.chainName}
              icon={getChainIcon(selectedChain)}
            />
          )}
          <Modal title="Select Chain" isOpen={modalState} size="small" closeModalHandler={closeModalHandler}>
            <SelectChainModal
              closeModalHandler={closeModalHandler}
              selectedChain={selectedChain}
              setSelectedChain={setSelectedChain}
            ></SelectChainModal>
          </Modal>
          <div className="select-box w-full flex rounded-xl overflow-hidden my-5 bg-gray40">
            <div className="select-box__token flex justify-evenly items-center w-24 h-16 cursor-pointer bg-gray30">
              <Icon iconSrc="assets/images/tokens/fantom.svg" width="32px" height="auto" />
              <Icon iconSrc="assets/images/fund/arrow-down.png" width="14px" height="auto" />
            </div>
            <div className="select-box__info w-full flex flex-col justify-between my-2 ml-3 mr-4">
              <div className="select-box__info__top w-full flex items-center justify-between">
                <p className="select-box__info__coin-symbol text-white text-xs font-semibold">TLS</p>
                <p className="select-box__info__coin-balance text-gray100 text-xs font-semibold">Balance: 1,049.00</p>
              </div>
              <div className="select-box__info__amount w-full">
                <input className="w-full text-xl bg-transparent text-white" type="number" step="0.001" placeholder="0.00" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
              </div>
            </div>
          </div>
          <ClaimButton
            width="100% !important"
            height="3.5rem"
            fontSize="20px"
            onClick={handleSendFunds}
            disabled={!Number(fundAmount) && isRightChain && active}
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

        </span>
      </ContentCard>
    </div>
  );
};

export default Content;
