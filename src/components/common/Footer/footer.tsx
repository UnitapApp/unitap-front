import React, { FC } from 'react';
import styled from 'styled-components';

import { DV } from 'components/basic/designVariables';

import Icon from 'components/basic/Icon/Icon';

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${DV.sizes.basePadding * 2}px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  background: ${DV.colors.black3};
`;

const Footer: FC = () => {
  return (
    <FooterWrapper>
      <Icon iconSrc="assets/images/footer/twitter.png" width="34px" height="auto" mr={4} hoverable></Icon>
      <Icon iconSrc="assets/images/footer/github.png" width="34px" height="auto" mr={4} hoverable></Icon>
      <Icon iconSrc="assets/images/footer/discord.png" width="34px" height="auto" hoverable></Icon>
    </FooterWrapper>
  );
};

export default Footer;
