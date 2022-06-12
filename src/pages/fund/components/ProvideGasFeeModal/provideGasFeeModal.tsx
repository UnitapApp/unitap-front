import React from 'react';

import { ProvideGasFeeModalWrapper } from './ProvideGasFeeModal.style';
import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';
import { SecondaryButton } from 'components/basic/Button/button';

const ProvideGasFeeModal = ({
  provideGasFeeError,
  closeModalHandler,
}: {
  provideGasFeeError: string;
  closeModalHandler: () => void;
}) => {
  function successful() {
    return (
      <>
        <Icon mb={3} iconSrc="assets/images/fund/success-provide-spaceman.svg"></Icon>
        <Text fontSize="14px" color="space_green" textAlign="center">
          1000 xDAI Funded
        </Text>
        <SecondaryButton fontSize="14px" size="large">
          View on Explorer
        </SecondaryButton>
      </>
    );
  }

  function failed() {
    return (
      <>
        <Icon mb={3} iconSrc="assets/images/fund/failed-provide-spaceman.svg"></Icon>
        <Text fontSize="14px" color="warningRed" textAlign="center">
          {provideGasFeeError}
        </Text>
        <SecondaryButton onClick={closeModalHandler} fontSize="14px" size="large">
          Try Again
        </SecondaryButton>
      </>
    );
  }

  return <ProvideGasFeeModalWrapper>{provideGasFeeError ? failed() : successful()}</ProvideGasFeeModalWrapper>;
};

export default ProvideGasFeeModal;
