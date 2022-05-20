import React, { useContext, useMemo } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { BrightConnectedButton, BrightOutlinedButton, LightOutlinedButton } from 'components/basic/Button/button';
import Modal from 'components/common/Modal/modal';
import BrightConnectionModal from 'components/pages/home/components/BrightConnectionModal/brightConnectionModal';
import { Spaceman } from 'constants/spaceman';
import { UserProfileContext } from 'hooks/useUserProfile';
import { BrightIdVerificationStatus } from 'types';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { shortenAddress } from 'utils';

// ###### Local Styled Components

const Nav = styled.div`
  display: flex;
  background-color: rgba(21, 21, 27, 0.6);
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 8}px;

  & > img {
    width: 200px;
    margin-right: auto;
  }
`;

const DesktopNav = styled.div`
  display: none;
  @media only screen and (min-width: 992px) {
    display: block;
  }
`;

const MobileNav = styled.div`
  display: none;
  @media only screen and (max-width: 992px) {
    display: block;
  }
  .checkbox {
    position: absolute;
    display: block;
    height: 32px;
    width: 32px;
    top: 20px;
    right: 20px;
    z-index: 1002;
    opacity: 0;
    cursor: pointer;
  }

  .hamburger-lines {
    height: 26px;
    width: 32px;
    padding-left: ${DV.sizes.basePadding * -2}px;
    position: absolute;
    top: ${DV.sizes.basePadding * 3}px;
    right: 20px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .line {
      display: block;
      height: 4px;
      width: 100%;
      border-radius: 10px;
      background: white;
    }

    .line1 {
      transform-origin: 0% 0%;
      transition: transform 0.4s ease-in-out;
    }

    .line2 {
      transition: transform 0.2s ease-in-out;
    }

    .line3 {
      transform-origin: 0% 100%;
      transition: transform 0.4s ease-in-out;
    }
  }

  .menu-items {
    position: fixed;
    z-index: 1000;
    box-sizing: border-box;
    inset: 0;
    padding: ${DV.sizes.basePadding * 8}px ${DV.sizes.basePadding * 4}px;
    background-color: rgba(5, 5, 5, 0.65);
    /* height: 100vh; */
    width: 100%;
    transform: translate(-100%);
    display: flex;
    justify-content: center;
    flex-direction: column;
    transition: transform 0.5s ease-in-out;
    text-align: center;
  }

  input[type='checkbox']:checked ~ .hamburger-lines .line1 {
    transform: rotate(45deg);
  }

  input[type='checkbox']:checked ~ .hamburger-lines .line2 {
    transform: scaleY(0);
  }

  input[type='checkbox']:checked ~ .hamburger-lines .line3 {
    transform: rotate(-45deg);
  }

  input[type='checkbox']:checked ~ .menu-items {
    transform: translateX(0);
  }
`;

const Navbar = ({ handleConnect }: { handleConnect: any }) => {
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false);
  const changeModalActive = (state: boolean) => {
    setIsModalActive(state);
  };
  const { active, account } = useActiveWeb3React();

  const { userProfile } = useContext(UserProfileContext);

  const connectBrightButtonLabel = useMemo(() => {
    if (account) {
      if (userProfile) {
        return userProfile.verificationStatus === BrightIdVerificationStatus.VERIFIED
          ? 'BrightID Connected'
          : 'Connect BrightID';
      }
      return 'Loading...';
    }
    return 'Connect BrightID';
  }, [account, userProfile]);

  return (
    <Nav>
      <img src="logo.png" alt="" />
      <DesktopNav>
        {userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED ? (
          <BrightConnectedButton
            data-testid="brightid-connected"
            icon="green-tick.png"
            iconWidth={24}
            iconHeight={16}
            mr={2}
          >
            {connectBrightButtonLabel}
          </BrightConnectedButton>
        ) : (
          <BrightOutlinedButton
            data-testid="brightid-show-modal"
            disabled={!account}
            mr={2}
            onClick={() => {
              if (userProfile && userProfile.verificationStatus === BrightIdVerificationStatus.PENDING) {
                changeModalActive(true);
              }
            }}
          >
            {connectBrightButtonLabel}
          </BrightOutlinedButton>
        )}
        {active ? (
          <LightOutlinedButton data-testid="wallet-connect">{shortenAddress(account)}</LightOutlinedButton>
        ) : (
          <LightOutlinedButton data-testid="wallet-connect" onClick={handleConnect}>
            Connect Wallet
          </LightOutlinedButton>
        )}
      </DesktopNav>

      <MobileNav>
        <input className="checkbox" type="checkbox" name="" id="" />
        <div className="hamburger-lines">
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </div>
        <div className="menu-items">
          {userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED ? (
            <BrightConnectedButton
              data-testid="brightid-connected"
              icon="green-tick.png"
              iconWidth={24}
              iconHeight={16}
              mb={2}
            >
              {connectBrightButtonLabel}
            </BrightConnectedButton>
          ) : (
            <BrightOutlinedButton
              data-testid="brightid-show-modal"
              mb={2}
              disabled={!account}
              onClick={() => {
                if (userProfile && userProfile.verificationStatus === BrightIdVerificationStatus.PENDING) {
                  changeModalActive(true);
                }
              }}
            >
              {connectBrightButtonLabel}
            </BrightOutlinedButton>
          )}
          {active ? (
            <LightOutlinedButton data-testid="wallet-connect">{shortenAddress(account)}</LightOutlinedButton>
          ) : (
            <LightOutlinedButton data-testid="wallet-connect" onClick={handleConnect}>
              Connect Wallet
            </LightOutlinedButton>
          )}
        </div>
      </MobileNav>

      <Modal
        spaceman={Spaceman.WITH_PHONE}
        title="connect bright id"
        isOpen={isModalActive}
        closeModalHandler={() => {
          changeModalActive(false);
        }}
      >
        <BrightConnectionModal
          closeModalHandler={() => {
            changeModalActive(false);
          }}
        />
      </Modal>
    </Nav>
  );
};

export default Navbar;
