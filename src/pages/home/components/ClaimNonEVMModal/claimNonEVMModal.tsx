import React, { useContext } from 'react';

import Modal from 'components/common/Modal/modal';
import Icon from 'components/basic/Icon/Icon';
import { ClaimContext } from 'hooks/useChainList';
import { ClaimNonEVMModalState } from 'types';

import { formatWeiBalance } from 'utils/numbers';

const ClaimNonEVMModalContent = () => {
  const { activeNonEVMChain } = useContext(ClaimContext);

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

      <div className='address-input flex w-full bg-gray30 rounded-xl my-6 p-2.5 items-center'>
        <input className='address-input__input w-full placeholder:text-gray80 text-xs mr-2 bg-transparent text-white' type='text' placeholder='Your Non-EVM Wallet Address...' />
        <button className='address-input__paste-button btn btn--sm btn--primary-light font-semibold tracking-wide'>PASTE</button>
      </div>

      <button className='btn btn--primary-outlined w-full'><p> Claim {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} </p></button>
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
