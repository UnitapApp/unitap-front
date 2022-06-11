import React, { useCallback, useContext, useMemo } from 'react';
import { BrightConnectedButton, BrightOutlinedButton, LightOutlinedButton } from 'components/basic/Button/button';
import Modal from 'components/common/Modal/modal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';
import { Spaceman } from 'constants/spaceman';
import { UserProfileContext } from 'hooks/useUserProfile';
import { BrightIdVerificationStatus } from 'types';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { shortenAddress } from 'utils';
import { injected } from '../../../connectors';
import Icon from 'components/basic/Icon/Icon';
import { NavbarWrapper, DesktopNav, MobileNav } from './navbar.style';

const Navbar = () => {
  const { activate } = useActiveWeb3React();
  const connect = useCallback(async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }, [activate]);

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
    <NavbarWrapper>
      <Icon iconSrc="logo.png" width="250px" height="40px" mrAuto></Icon>
      <DesktopNav>
        {userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED ? (
          <BrightConnectedButton
            className="has-icon"
            data-testid="brightid-connected"
            icon="green-tick.png"
            fontSize="12px"
            fontWeight='normal'
            minWidth="175px" 
            iconWidth={14}
            iconHeight={10}
            mr={2}
          >
            {connectBrightButtonLabel}
          </BrightConnectedButton>
        ) : (
          <BrightOutlinedButton
            data-testid="brightid-show-modal"
            disabled={!account}
            fontSize="12px"
            fontWeight='normal'
            minWidth="175px" 
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
          <LightOutlinedButton data-testid="wallet-connect" minWidth="175px" fontSize="12px">
            {shortenAddress(account)}
          </LightOutlinedButton>
        ) : (
          <LightOutlinedButton data-testid="wallet-connect" minWidth="175px" onClick={connect} fontSize="12px">
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
            <BrightConnectedButton icon="green-tick.png" iconWidth={24} iconHeight={16} mb={2}>
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
            <LightOutlinedButton>{shortenAddress(account)}</LightOutlinedButton>
          ) : (
            <LightOutlinedButton onClick={connect}>Connect Wallet</LightOutlinedButton>
          )}
        </div>
      </MobileNav>

      <Modal
        className="bright-modal"
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
    </NavbarWrapper>
  );
};

export default Navbar;
