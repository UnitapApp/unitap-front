import React, { FC } from 'react';
import styled from 'styled-components';
import Navbar from 'components/common/Navbar/navbar';
import { DV } from 'components/basic/designVariables';
import Icon from 'components/basic/Icon/Icon';
import { Text } from 'components/basic/Text/text.style';
import { LandingClaimIconButton } from 'components/basic/Button/button';
import RoutePath from 'routes';
import { Link } from 'react-router-dom';

const LandingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${DV.colors.dark};
  background-image: url('assets/images/landing/background-wave.svg');
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
      padding: 0 24vw;
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

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-image: url('assets/images/landing/background-wave.svg');
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
  return (
    <>
      <Navbar />
      <LandingWrapper>
        <nav className="landing__navbar px-4">
          <Icon iconSrc="logo.svg" width="270px" xsWidth="40vw" height="auto"></Icon>
        </nav>
        <div className="landing__hero">
          <Icon
            iconSrc="assets/images/landing/logo-center.svg"
            width="75px"
            height="auto"
            mb={3}
            smMb={1}
            smWidth="80px"
          ></Icon>
          <Icon
            iconSrc="assets/images/landing/name-center.svg"
            width="190px"
            height="auto"
            mb={6}
            smMb={1}
            smWidth="170px"
          ></Icon>
          <Text fontSize="28" textAlign="center" mb={7} smFontSize="20">
            A gateway to networks and communities.
          </Text>
          <div className="landing__hero__action-buttons">
            <Link to={RoutePath.FAUCET}>
              <LandingClaimIconButton
                className="has-icon"
                icon="assets/images/landing/claim-button-logo.svg"
                iconWidth={16}
                smIconWidth={12}
                iconHeight={22}
                smIconHeight={16}
                iconMarginLeft={100}
                fontSize="20px"
                smFontSize="16px"
                width="280px"
                mr={4}
                mb={2}
              >
                Gas Tap
              </LandingClaimIconButton>
            </Link>
            <LandingClaimIconButton
              className="has-icon"
              icon="assets/images/landing/soon-logo.svg"
              iconWidth={40}
              smIconWidth={30}
              iconHeight={20}
              smIconHeight={15}
              iconMarginLeft={55}
              fontSize="20px"
              smFontSize="16px"
              width="280px"
              disabled
            >
              Token Tap
            </LandingClaimIconButton>
          </div>
        </div>
        <footer className="landing__footer">
          <span onClick={() => window.open('http://twitter.com/unitap_app', '_blank')}>
            <Icon iconSrc="assets/images/footer/twitter.svg" width="34px" height="auto" mr={4} hoverable></Icon>
          </span>
          <span onClick={() => window.open('https://github.com/UnitapApp', '_blank')}>
            <Icon iconSrc="assets/images/footer/github.svg" width="34px" height="auto" mr={4} hoverable></Icon>
          </span>
          <span onClick={() => window.open('https://discord.gg/kH8WeQ6tuF', '_blank')}>
            <Icon iconSrc="assets/images/footer/discord.svg" width="34px" height="auto" hoverable></Icon>
          </span>
        </footer>
      </LandingWrapper>
    </>
  );
};

export default Landing;
