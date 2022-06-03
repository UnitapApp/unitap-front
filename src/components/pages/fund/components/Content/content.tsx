import React, { FC } from 'react';
import { PrimaryButton } from 'components/basic/Button/button';
import { ContentWrapper } from './content.style';
import Icon from 'components/basic/Icon/Icon';
import Input from 'components/basic/Input/input';
import Dropdown from 'components/basic/Dropdown/dropdown';

const Content: FC = () => {
  return (
    <ContentWrapper>
      <Icon iconSrc={'assets/images/fund/content-header.png'} width="220px" height="auto"/>
      <p className="content-text">Fund any amount higher than 100$.</p>
      <p className="content-subtext">
        99% of fund amount goes for Claim Gas Fees. <br /> 1% of fund amount goes for Unitap development.
      </p>
      <Dropdown label="Chain" value='Gnosis Chain' icon='assets/images/fund/coin-icon.png'></Dropdown>
      <Input label="Fund Amount" postfix="xDai" type="success" placeholder='0.00'></Input>
      <PrimaryButton width="100%" height="3.5rem" fontSize="20px">Submit Fund</PrimaryButton>
    </ContentWrapper>
  );
};

export default Content;
