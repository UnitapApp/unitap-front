import React, { FC } from 'react';

import { ProvideGasFeeModalWrapper } from './ProvideGasFeeModal.style';
import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';
import { SecondaryButton } from 'components/basic/Button/button';

const ProvideGasFeeModal: FC = () => {
  function successful() {
    return (
      <>
        <Icon mb={3} iconSrc="assets/images/fund/success-provide-spaceman.svg"></Icon>
        <Text fontSize="14px" color="space_green" textAlign="center" breakOverflow>
          1000 xDAI Funded ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        </Text>
        <SecondaryButton fontSize='14px' size="large">View on Explorer</SecondaryButton>
      </>
    );
  }

  function failed() {
    return (
      <>
        <Icon mb={3} iconSrc="assets/images/fund/failed-provide-spaceman.svg"></Icon>
        <Text fontSize="14px" color="warningRed" textAlign="center" breakOverflow>
          1000 xDAI Fund Failed eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
        </Text>
        <SecondaryButton fontSize='14px' size="large">Try Again</SecondaryButton>
      </>
    );
  }

  return <ProvideGasFeeModalWrapper>{false ? successful() : failed()}</ProvideGasFeeModalWrapper>;
};

export default ProvideGasFeeModal;
