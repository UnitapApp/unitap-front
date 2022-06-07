import React, { FC } from 'react';
import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';
import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';
import { LandingClaimIconButton } from 'components/basic/Button/button';

const LandingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url('assets/images/landing/background.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;

  .landing {
    box-sizing: border-box;

    &__navbar {
      display: flex;
      justify-content: start;
      align-items: flex-start;
      width: 100%;
      height: 10vh;
      padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 10}px;
    }

    &__hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70vh;
    }

    &__footer {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${DV.sizes.basePadding * 2}px;
      box-sizing: border-box;
    }
  }
`;

const Landing: FC = () => {
  return (
    <LandingWrapper>
      <nav className="landing__navbar">
        <Icon iconSrc="logo.png" width="270px" height="auto"></Icon>
      </nav>
      <div className="landing__hero">
        <Icon iconSrc="assets/images/landing/logo-center.png" width="75px" height="auto" mb={3}></Icon>
        <Icon iconSrc="assets/images/landing/name-center.svg" width="190px" height="auto" mb={6}></Icon>
        <Text fontSize="24" textAlign="center" mb={7}>
          Add EVM networks easily and connect your <br /> BrightID to claim Gas Fee and Tokens.
        </Text>
        <div className="landing__hero__action-buttons">
          <LandingClaimIconButton
            className="has-icon"
            icon="assets/images/landing/claim-button-logo.png"
            iconWidth={16}
            iconHeight={22}
            iconMarginLeft={55}
            fontSize="20px"
            mr={4}
          >
            Claim Gas Fee
          </LandingClaimIconButton>
          <LandingClaimIconButton
            className="has-icon"
            icon="assets/images/landing/soon-logo.png"
            iconWidth={40}
            iconHeight={20}
            iconMarginLeft={55}
            fontSize="20px"
          >
            Claim Token
          </LandingClaimIconButton>
        </div>
      </div>
      <footer className="landing__footer">
        <Icon iconSrc="assets/images/footer/twitter.png" width="34px" height="auto" mr={4} hoverable></Icon>
        <Icon iconSrc="assets/images/footer/github.png" width="34px" height="auto" mr={4} hoverable></Icon>
        <Icon iconSrc="assets/images/footer/discord.png" width="34px" height="auto" hoverable></Icon>
      </footer>
    </LandingWrapper>
  );
};

export default Landing;
