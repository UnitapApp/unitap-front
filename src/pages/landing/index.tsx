import React, { FC } from 'react';
import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';
import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';
import { LandingClaimIconButton } from 'components/basic/Button/button';
import RoutePath from 'routes';
import { useNavigate } from 'react-router-dom';

const LandingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url('assets/images/landing/background.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  position: relative;

  .landing {
    box-sizing: border-box;
    position: relative;

    &__navbar {
      display: flex;
      justify-content: start;
      align-items: flex-start;
      top: 0;
      left: 0;
      padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 10}px;
      position: absolute;
    }

    &__hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
      padding: 0 26vw;
    }

    &__footer {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${DV.sizes.basePadding * 2}px;
      box-sizing: border-box;
      position: absolute;
      bottom: 1rem;
    }
  }

  @media only screen and (max-width: 1224px) {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-image: url('assets/images/landing/background.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;
    position: relative;

    .landing {
      box-sizing: border-box;
      position: relative;

      &__navbar {
        display: flex;
        justify-content: start;
        align-items: flex-start;
        top: 0;
        left: 0;
        padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px;
        position: absolute;
      }

      &__hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 0 5vw;

        &__action-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;

          & Button {
            margin-right: 0 !important;
          }
        }
      }

      &__footer {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: ${DV.sizes.basePadding * 2}px;
        box-sizing: border-box;
        position: absolute;
        bottom: 1rem;
      }
    }
  }
`;

const Landing: FC = () => {
  const navigate = useNavigate();

  return (
    <LandingWrapper>
      <nav className="landing__navbar">
        <Icon iconSrc="logo.png" width="270px" height="auto"></Icon>
      </nav>
      <div className="landing__hero">
        <Icon iconSrc="assets/images/landing/logo-center.png" width="75px" height="auto" mb={3} smWidth="80px"></Icon>
        <Icon
          iconSrc="assets/images/landing/name-center.svg"
          width="190px"
          height="auto"
          mb={6}
          smMb={3}
          smWidth="170px"
        ></Icon>
        <Text fontSize="24" textAlign="center" mb={7} smFontSize="16">
          Add EVM networks easily and connect your BrightID to claim Gas Fee and Tokens.
        </Text>
        <div className="landing__hero__action-buttons">
          <LandingClaimIconButton
            onClick={() => navigate(RoutePath.FAUCET)}
            className="has-icon"
            icon="assets/images/landing/claim-button-logo.png"
            iconWidth={16}
            smIconWidth={12}
            iconHeight={22}
            smIconHeight={16}
            iconMarginLeft={55}
            fontSize="20px"
            smFontSize="16px"
            mr={4}
            mb={2}
          >
            Claim Gas Fee
          </LandingClaimIconButton>
          <LandingClaimIconButton
            className="has-icon"
            icon="assets/images/landing/soon-logo.png"
            iconWidth={40}
            smIconWidth={30}
            iconHeight={20}
            smIconHeight={15}
            iconMarginLeft={55}
            fontSize="20px"
            smFontSize="16px"
            disabled
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
