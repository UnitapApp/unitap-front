import React from 'react';

import { ProvideGasCardWrapper } from './provideGasCard.style';
import { Text } from 'components/basic/Text/text.style';
import { PrimaryOutlinedButton } from 'components/basic/Button/button';
import RoutePath from '../../../../routes';
import { Link } from 'react-router-dom';

const ProvideGasCard = () => {
  return (
    <ProvideGasCardWrapper>
      <Text fontSize="16px">
        <strong> Enjoying Unitap?</strong> Your Donation helps more users to claim Gas Fees.
      </Text>
      <Link to={RoutePath.FUND}>
        <PrimaryOutlinedButton width="220px" fontSize="14px" height="100%">
          Provide Gas Fee
        </PrimaryOutlinedButton>
      </Link>
    </ProvideGasCardWrapper>
  );
};

export default ProvideGasCard;
