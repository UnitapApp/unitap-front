import React, {useContext, useEffect} from 'react';

import Modal from 'components/common/Modal/modal';
import Icon from 'components/basic/Icon/Icon';
import {ClaimContext} from 'hooks/useChainList';
import {ClaimNonEVMModalState, ClaimReceiptState} from 'types';

import {formatWeiBalance} from 'utils/numbers';
import {Text} from 'components/basic/Text/text.style';
import {
  ClaimButton, ClaimedButton,
  LightOutlinedButtonNew,
  SecondaryButton, SecondaryGreenColorButton
} from 'components/basic/Button/button';
import {getChainClaimIcon, getTxUrl} from 'utils';
import {UserProfileContext} from "../../../../hooks/useUserProfile";
import lottie from "lottie-web";
import animation from "../../../../assets/animations/GasFee-delivery2.json";

const ClaimNonEVMModalContent = () => {
  const { activeNonEVMChain } = useContext(ClaimContext);

  const { activeClaimReceipt, openBrightIdModal } = useContext(ClaimContext);

  const {userProfile, nonEVMWalletAddress, setNonEVMWalletAddress} = useContext(UserProfileContext);

  const { claimNonEVM, closeClaimNonEVMModal, claimNonEVMLoading } = useContext(ClaimContext);

  const handleClaimNonEVMClicked = () => {
    if (activeNonEVMChain) {
      claimNonEVM(activeNonEVMChain.pk, nonEVMWalletAddress);
    }
  }

  useEffect(() => {
    if (activeClaimReceipt?.status === ClaimReceiptState.PENDING) {
      const animationElement = document.querySelector('#animation');
      if (animationElement) {
        animationElement.innerHTML = '';
      }
      lottie.loadAnimation({
        container: document.querySelector('#animation') as HTMLInputElement,
        animationData: animation,
        loop: true,
        autoplay: true,
      });
    }
  }, [activeClaimReceipt]);


  function renderBrightNotConnectedBody() {
    if (!activeNonEVMChain) return null;

    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mt-14 mb-10"
          iconSrc={getChainClaimIcon(activeNonEVMChain!) || activeNonEVMChain!.logoUrl}
          width="auto"
          height="110px"
        />
        <p className="text-white text-sm mb-5 mt-11">
          You need to connect your BrightID to claim your tokens
        </p>

        <ClaimButton
          onClick={openBrightIdModal}
          width="100%"
          className='!w-full'
          fontSize="16px"
          data-testid={`chain-claim-action-${activeNonEVMChain.pk}`}
        >
          <p>Connect BrightID</p>
        </ClaimButton>
      </>
    );
  }

  function renderBrightNotVerifiedBody() {
    return (
      <>
        <div
          className="bright-connection-modal flex flex-col items-center justify-center pt-2"
          data-testid="brightid-modal"
        >
          <Icon
            data-testid="brightid-logo"
            className="bright-logo !w-4/12 z-10 mb-5"
            iconSrc="assets/images/modal/bright-id-logo-checked.svg"
          />
          <p className="text-sm font-bold text-error mb-2">You are not verified on BrightID</p>
          <p className="text-xs font-medium text-gray100 mb-12 text-center px-4 leading-6">
            BrightID is a social identity network that allows users to prove that they are only using one account.
          </p>

          <span className="w-full relative">
            <LightOutlinedButtonNew className="!w-full" onClick={() => window.open('https://meet.brightid.org/', '_blank')}>
              Verify on BrightID <Icon className='cursor-pointer arrow-icon mt-0.5 ml-1.5 w-2' iconSrc="assets/images/arrow-icon.svg" />
            </LightOutlinedButtonNew>
            <Icon iconSrc="assets/images/modal/bright-id-check.svg" className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2"/>
          </span>

          {/* eslint-disable-next-line no-restricted-globals */}
          <p className="text-white mt-4 text-xs hover:underline cursor-pointer" onClick={() => location.reload()}>If you verified your BrightID click here.</p>
        </div>
      </>
    );
  }

  function renderInitialBody() {
    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mt-14 mb-10"
          iconSrc={getChainClaimIcon(activeNonEVMChain!) || activeNonEVMChain!.logoUrl}
          width="auto"
          height="110px"
        />
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
          className={`btn ${!nonEVMWalletAddress || claimNonEVMLoading ? 'btn--disabled' : 'btn--primary-outlined'} w-full`}
          onClick={() => handleClaimNonEVMClicked()}
        >
          {claimNonEVMLoading ?
            <p> Claiming {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} </p>
            :
            <p> Claim {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} </p>
          }
        </button>
      </>
    )
  }

  function renderPendingBody() {
    if (!activeNonEVMChain) return null;

    return (
      <>
        <div data-testid={`chain-claim-pending-${activeNonEVMChain.pk}`} id="animation" style={{ width: '200px' }}></div>
        <Text width="100%" fontSize="14" color="space_green" textAlign="center">
          Claim transaction submitted
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          The claim transaction will be compeleted soon
        </Text>
        <SecondaryGreenColorButton
          onClick={closeClaimNonEVMModal}
          width={'100%'}
          data-testid={`chain-claim-action-${activeNonEVMChain.pk}`}
        >
          Close
        </SecondaryGreenColorButton>
      </>
    );
  }

  function renderSuccessBody() {
    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mt-14 mb-10"
          iconSrc={getChainClaimIcon(activeNonEVMChain!) || activeNonEVMChain!.logoUrl}
          width="auto"
          height="110px"
        />
        <Text width="100%" fontSize="14" color="space_green" textAlign="center">
          {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} Claimed
        </Text>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          we successfully transferred {formatWeiBalance(activeNonEVMChain!.maxClaimAmount)} {activeNonEVMChain!.symbol} to your wallet
        </Text>
        <ClaimButton
          fontSize="16px"
          className="!w-full"
          onClick={() => window.open(getTxUrl(activeNonEVMChain!, activeClaimReceipt!.txHash!), "_blank")}
          data-testid={`chain-claim-action-${activeNonEVMChain!.pk}`}
        >
          <p>View on Explorer</p>
        </ClaimButton>
      </>
    )
  }

  function renderFailedBody() {
    if (!activeNonEVMChain) return null;

    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mt-14 mb-10"
          iconSrc={getChainClaimIcon(activeNonEVMChain!) || activeNonEVMChain!.logoUrl}
          width="auto"
          height="110px"
        />
        <span className='flex justify-center items-center font-medium mb-3'>
          <Text className='!mb-0' width="100%" fontSize="14" color="warningRed" textAlign="center">
            Claim Failed!
          </Text>
          <Icon iconSrc="assets/images/modal/failed-state-x.svg" width="22px" height='auto' className='ml-2' />
        </span>
        <Text width="100%" fontSize="14" color="second_gray_light" mb={3} textAlign="center">
          An error occurred while processing your request
        </Text>
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
        <ClaimButton
          fontSize="16px"
          onClick={handleClaimNonEVMClicked}
          width={'100%'}
          className="!w-full"
          data-testid={`chain-claim-action-${activeNonEVMChain.pk}`}
        >
          <p>Try Again</p>
        </ClaimButton>
      </>
    );
  }

  const getClaimNonEVMModalBody = () => {
    if (!userProfile?.profile) return renderBrightNotConnectedBody();

    if (!userProfile.profile.isMeetVerified) return renderBrightNotVerifiedBody();

    if (!activeClaimReceipt) return renderInitialBody();

    if (activeClaimReceipt.status === ClaimReceiptState.VERIFIED) return renderSuccessBody();

    if (activeClaimReceipt.status === ClaimReceiptState.PENDING) return renderPendingBody();

    if (activeClaimReceipt.status === ClaimReceiptState.REJECTED) return renderFailedBody();
  }

  return (
    <div
      className="claim-non-evm-modal flex flex-col items-center justify-center pt-2"
      data-testid="claim-non-evm-modal"
    >
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
