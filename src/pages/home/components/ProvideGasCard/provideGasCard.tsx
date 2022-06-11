import React from 'react';

import { ProvideGasCardWrapper } from './provideGasCard.style';
import { Text } from 'components/basic/Text/text.style';
import { PrimaryOutlinedButton } from 'components/basic/Button/button';

const ProvideGasCard = () => {
  return (
    <ProvideGasCardWrapper>
      <Text fontSize='16px'>
        <strong> Enjoying Unitap?</strong> Your Donatation helps more users to claim Gas Fees.
      </Text>
      <PrimaryOutlinedButton width='220px' fontSize='14px'>Provide Gas Fee</PrimaryOutlinedButton>
    </ProvideGasCardWrapper>
  );
};

export default ProvideGasCard;
