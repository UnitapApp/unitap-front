import React, { useContext, useState } from 'react';

import Modal from 'components/common/Modal/modal';
import Icon from 'components/basic/Icon/Icon';
import { ClaimContext } from 'hooks/useChainList';
import { ClaimBoxState, ClaimNonEVMModalState } from 'types';

import { formatWeiBalance } from 'utils/numbers';
import { Text } from 'components/basic/Text/text.style';
import { ClaimBoxRequestButton, SecondaryButton } from 'components/basic/Button/button';
import { getChainClaimIcon, getTxUrl, shortenAddress } from 'utils';
import WalletAddress from '../ClaimModal/walletAddress';

const ClaimNonEVMModalContent = () => {
  const { activeNonEVMChain } = useContext(ClaimContext);
  const [nonEVMWalletAddress, setNonEVMWalletAddress] = useState<string>('');
  const { activeClaimReceipt } = useContext(ClaimContext);
  const [loading, setLoading] = useState(false);

  const { claimNonEVM } = useContext(ClaimContext);

  const handleClaimNonEVMClicked = () => {
    if (activeNonEVMChain) {
      setLoading(true);
      claimNonEVM(activeNonEVMChain.pk, nonEVMWalletAddress);
    }
  }

  function renderInitialBody() {
    return (
      <>
        <div className='address-input flex w-full bg-gray30 rounded-xl my-6 p-2.5 items-center'>
          <input
            className='address-input__input w-full placeholder:text-gray80 text-sm mx-1.5 bg-transparent text-white'
            type='text'
            placeholder='Your Non-EVM Wallet Address...'
            value={nonEVMWalletAddress}
            onChange={(e) => setNonEVMWalletAddress(e.target.value)}
          />
          <button
            className='address-input__paste-button btn btn--sm btn--primary-light font-semibold tracking-wide'
            onClick={() => navigator.clipboard.readText().then((text) => setNonEVMWalletAddress(text))}
          >
            PASTE
          </button>
        </div>

        <button
          className={`btn ${!nonEVMWalletAddress || loading ? 'btn--disabled' : 'btn--primary-outlined'} w-full`}
          onClick={() => handleClaimNonEVMClicked()}
        >
          {loading ?
            <p> Claiming {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} </p>
            :
            <p> Claim {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} </p>
          }
        </button>
      </>
    )
  }

  function renderRequestBody() {
    return (
      <>
        <Text width="100%" fontSize="14">
          Wallet Address
        </Text>
        <WalletAddress fontSize="12">{shortenAddress(nonEVMWalletAddress)}</WalletAddress>
        <ClaimBoxRequestButton width="100%" fontSize="20px" data-testid={`chain-claim-action-${activeNonEVMChain!.pk}`}>
          Pending ...
        </ClaimBoxRequestButton>
      </>
    );
  }

  function renderSuccessBody() {
    return (
      <>
        <Text width="100%" fontSize="14" color="space_green" textAlign="center">
          {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} Claimed
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          we successfully transferred {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} to your wallet
        </Text>
        <SecondaryButton
          onClick={() => window.open(getTxUrl(activeNonEVMChain!, activeClaimReceipt!.txHash!), "_blank")}
          width={"100%"}
          fontSize="20px"
          data-testid={`chain-claim-action-${activeNonEVMChain!.pk}`}
          color="space_green"
        >
          View on Explorer
        </SecondaryButton>
      </>
    )
  }

  function getClaimBoxState() {
    if (activeClaimReceipt) {
      if (loading) setLoading(false);
      if (activeClaimReceipt.status === "1") {
        return ClaimBoxState.VERIFIED;
      } else if (activeClaimReceipt.status === "0") {
        return ClaimBoxState.REQUEST;
      }
    } else {
      return ClaimBoxState.INITIAL;
    }
  }

  const getClaimNonEVMModalBody = () => {
    if (getClaimBoxState() === ClaimBoxState.INITIAL) {
      return renderInitialBody();
    } else if (getClaimBoxState() === ClaimBoxState.VERIFIED) {
      return renderSuccessBody();
    } else if (getClaimBoxState() === ClaimBoxState.REQUEST) {
      return renderRequestBody();
    }
  }

  return (
    <div
      className="claim-non-evm-modal flex flex-col items-center justify-center pt-2"
      data-testid="claim-non-evm-modal"
    >
      <Icon
        data-testid="chain-logo"
        className="chain-logo z-10 mt-14 mb-10"
        iconSrc={getChainClaimIcon(activeNonEVMChain!) || activeNonEVMChain!.logoUrl}
        width="auto"
        height="110px"
      />

      {getClaimNonEVMModalBody()}
    </div>
  );
};

const ClaimNonEVMModal = () => {
  const { activeNonEVMChain } = useContext(ClaimContext);
  const { claimNonEVMModalStatus, closeClaimNonEVMModal } = useContext(ClaimContext);

  if (!activeNonEVMChain) return null;

  return (
    <Modal
      title={`Claim ${formatWeiBalance(activeNonEVMChain.maxClaimAmount)} ${activeNonEVMChain.symbol}`}
      size="small"
      isOpen={claimNonEVMModalStatus !== ClaimNonEVMModalState.CLOSED}
      closeModalHandler={closeClaimNonEVMModal}
    >
      <ClaimNonEVMModalContent />
    </Modal>
  );
};

export default ClaimNonEVMModal;
