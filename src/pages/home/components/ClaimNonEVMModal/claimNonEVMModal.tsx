import React, { useContext, useState } from 'react';

import Modal from 'components/common/Modal/modal';
import Icon from 'components/basic/Icon/Icon';
import { ClaimContext } from 'hooks/useChainList';
import { ClaimBoxState, ClaimNonEVMModalState } from 'types';

import { formatWeiBalance } from 'utils/numbers';
import { Text } from 'components/basic/Text/text.style';
import { SecondaryButton } from 'components/basic/Button/button';
import { getTxUrl } from 'utils';

const ClaimNonEVMModalContent = () => {
  const { activeNonEVMChain } = useContext(ClaimContext);
  const [nonEVMWalletAddress, setNonEVMWalletAddress] = useState<string>('');
  const { activeClaimReceipt } = useContext(ClaimContext);

  const { claimNonEVM } = useContext(ClaimContext);

  const handleClaimNonEVMClicked = () => {
    if (activeNonEVMChain) {
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
          className={`btn ${!nonEVMWalletAddress ? 'btn--disabled' : 'btn--primary-outlined'} w-full`}
          onClick={() => handleClaimNonEVMClicked()}
        >
          <p> Claim {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} </p>
        </button>
      </>
    )
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
      if (activeClaimReceipt.status === "1") {
        return ClaimBoxState.VERIFIED;
      } else {
        return ClaimBoxState.INITIAL;
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
    }
  }

  return (
    <div
      className="claim-non-evm-modal flex flex-col items-center justify-center pt-2"
      data-testid="claim-non-evm-modal"
    >
      <Icon
        data-testid="chain-logo"
        className="chain-logo z-10 mt-20 mb-14"
        iconSrc={activeNonEVMChain!.gasImageUrl || activeNonEVMChain!.logoUrl}
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
