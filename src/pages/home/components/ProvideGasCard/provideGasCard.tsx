import React from 'react';

import { ProvideGasCardWrapper } from './provideGasCard.style';
import { Text } from 'components/basic/Text/text.style';
import { PrimaryOutlinedButton } from 'components/basic/Button/button';
import RoutePath from '../../../../routes';
import { Link } from 'react-router-dom';

const ProvideGasCard = () => {
  return (
    <ProvideGasCardWrapper>
      <Text fontSize="16" mb={0} mdMb={2}>
        <strong> Enjoying Unitap?</strong> Donate to help support more users access this service.
      </Text>
      <Link to={RoutePath.FUND}>
        <PrimaryOutlinedButton width="230px" fontSize="14" height="46px">
          Help fund Gas Fees
        </PrimaryOutlinedButton>
      </Link>
    </ProvideGasCardWrapper>
  );
};

export default ProvideGasCard;
