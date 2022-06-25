import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from 'components/basic/Button/button';
import { ContentCard, ContentWrapper } from './content.style';
import Icon from 'components/basic/Icon/Icon';
import Input from 'components/basic/Input/input';
import Dropdown from 'components/basic/Dropdown/dropdown';
import { ClaimContext } from '../../../../hooks/useChainList';
import { Chain } from '../../../../types';
import { useAddAndSwitchToChain } from '../../../../hooks/useAddAndSwitchToChain';
import useActiveWeb3React from '../../../../hooks/useActiveWeb3React';
import { parseEther } from '@ethersproject/units';
import Modal from 'components/common/Modal/modal';
import SelectChainModal from '../SelectChainModal/selectChainModal';
import FundTransactionModal from '../FundTransactionModal/FundTransactionModal';
import useWeb3Connector from '../../../../hooks/useWeb3Connector';
import { getChainIcon } from '../../../../utils';
import { calculateGasMargin, USER_DENIED_REQUEST_ERROR_CODE } from '../../../../utils/web3';

const Content: FC = () => {
  const { chainList } = useContext(ClaimContext);
  const { active, chainId, library, account } = useActiveWeb3React();
  const { connect } = useWeb3Connector();

  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  useEffect(() => {
    if (chainList.length > 0 && !selectedChain) {
      setSelectedChain(chainList[0]);
    }
  }, [chainList, selectedChain]);

  const { addAndSwitchToChain } = useAddAndSwitchToChain();

  const [fundAmount, setFundAmount] = useState<string>('');

  const [modalState, setModalState] = useState(false);
  const [fundTransactionError, setFundTransactionError] = useState('');
  const [txHash, setTxHash] = useState('');
  const isRightChain = useMemo(() => {
    if (!active || !chainId || !selectedChain) return false;
    return chainId === Number(selectedChain.chainId);
  }, [selectedChain, active, chainId]);

  const handleTransactionError = useCallback((error: any) => {
    if (error?.code === USER_DENIED_REQUEST_ERROR_CODE) return;
    const message = error?.data?.message || error?.error?.message;
    if (message) {
      if (message.includes('insufficient funds')) {
        setFundTransactionError('Error: Insufficient Funds');
      } else {
        setFundTransactionError(message);
      }
    } else {
      setFundTransactionError('Unexpected error. Could not estimate gas for this transaction.');
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
      await connect();
      return;
    }
    if (!chainId || !selectedChain || !account || loading) return;
    if (!isRightChain) {
      await addAndSwitchToChain(selectedChain);
      return;
    }
    if (!Number(fundAmount)) {
      alert('Enter fund amount');
      return;
    }
    if (!library) return;
    const tx = {
      from: account,
      to: selectedChain.fundManagerAddress,
      value: parseEther(fundAmount),
    };
    setSubmittingFundTransaction(true);
    const estimatedGas = await library.estimateGas(tx).catch((err: any) => {
      return err;
    });

    if ('error' in estimatedGas || 'code' in estimatedGas) {
      handleTransactionError(estimatedGas);
      setSubmittingFundTransaction(false);
      return;
    }

    library
      .getSigner()
      .sendTransaction({
        ...tx,
        ...(estimatedGas ? { gasLimit: calculateGasMargin(estimatedGas) } : {}),
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
    library,
    connect,
    addAndSwitchToChain,
    handleTransactionError,
  ]);

  const closeModalHandler = () => {
    setFundTransactionError('');
    setTxHash('');
    setModalState(false);
  };

  const fundActionButtonLabel = useMemo(() => {
    if (!active) {
      return 'Connect Wallet';
    }
    if (loading) {
      return 'Loading...';
    }
    return !isRightChain ? 'Switch Network' : 'Submit Contribution';
  }, [active, isRightChain, loading]);

  return (
    <ContentWrapper>
      <ContentCard>
        <Icon iconSrc={'assets/images/fund/help-fund-the-tap.svg'} width="220px" height="auto" mb={2} />
        <p className="content-subtext">
          99% of contributions will be distributed via the tap.
          <br /> 1% of contributions will fund Unitap development.
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
        <Input
          data-testid="fund-input"
          className="fund-input"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
          label="Fund Amount"
          postfix={selectedChain?.symbol || ''}
          type="number"
          step="0.001"
          styleType="success"
          placeholder="0.00"
          width="100%"
          fontSize="24px"
        />
        <PrimaryButton
          width="100%"
          height="3.5rem"
          fontSize="20px"
          onClick={handleSendFunds}
          disabled={!Number(fundAmount) && isRightChain && active}
          data-testid="fund-action"
        >
          {fundActionButtonLabel}
        </PrimaryButton>
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
      </ContentCard>
    </ContentWrapper>
  );
};

export default Content;
