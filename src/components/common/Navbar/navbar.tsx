import React, { useContext, useMemo } from 'react';
import {
  BrightConnectedButton,
  BrightOutlinedButton,
  BrightPrimaryButton,
  GradientOutlinedButton,
  LightOutlinedButton,
  PrimaryOutlinedButton,
} from 'components/basic/Button/button';
import { UserProfileContext } from 'hooks/useUserProfile';
import { BrightIdVerificationStatus } from 'types';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { shortenAddress } from 'utils';
import { DesktopNav, MobileNav, NavbarWrapper, NavLogo } from './navbar.style';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RoutePath from 'routes';
import useWeb3Connector from '../../../hooks/useWeb3Connector';
import { ClaimContext } from 'hooks/useChainList';
import Icon from 'components/basic/Icon/Icon';

const Navbar = () => {
  const { connect } = useWeb3Connector();

  const { openBrightIdModal } = useContext(ClaimContext);
  const { active, account, chainId } = useActiveWeb3React();

  const { userProfile } = useContext(UserProfileContext);

  const connectBrightButtonLabel = useMemo(() => {
    if (account) {
      if (userProfile) {
        return userProfile.verificationStatus === BrightIdVerificationStatus.VERIFIED
          ? 'Connected'
          : 'Connect BrightID';
      }
      return 'Loading...';
    }
    return 'Connect BrightID';
  }, [account, userProfile]);

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <NavbarWrapper>
      <NavLogo
        iconSrc="assets/images/navbar/navbar_logo_v1.3.svg"
        width="140px"
        height="32px"
        mrAuto
        onClick={() => navigate(RoutePath.LANDING)}
        style={{ cursor: 'pointer' }}
      />
      {process.env.REACT_APP_IS_CYPRESS === 'true' && <span data-testid="chain-id">{chainId}</span>}
      <DesktopNav>
        {location.pathname === RoutePath.FUND ? (
          <Link to={RoutePath.FAUCET}>
            <PrimaryOutlinedButton mr={2} minWidth="175px">
              Claim Gas Fee
            </PrimaryOutlinedButton>
          </Link>
        ) : userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED ? (
          <BrightConnectedButton
            className="has-icon"
            data-testid="brightid-connected"
            iconLeft="assets/images/navbar/navbar_bright_logo_v1.3.svg"
            fontSize="12px"
            fontWeight="500"
            minWidth="130px"
            iconLeftWidth={16}
            iconLeftHeight={16}
            mr={2}
          >
            {connectBrightButtonLabel}
          </BrightConnectedButton>
        ) : (
          <BrightPrimaryButton
            data-testid="brightid-show-modal"
            disabled={!account}
            fontSize="12px"
            fontWeight="800"
            minWidth="150px"
            mr={2}
            onClick={() => {
              if (userProfile && userProfile.verificationStatus === BrightIdVerificationStatus.PENDING) {
                openBrightIdModal();
              }
            }}
          >
            {connectBrightButtonLabel}
          </BrightPrimaryButton>
        )}
        {active ? (
          <LightOutlinedButton data-testid="wallet-connect" minWidth="155px" fontSize="12px" fontWeight="400" mr={2}>
            {shortenAddress(account)}
          </LightOutlinedButton>
        ) : (
          <GradientOutlinedButton
            data-testid="wallet-connect"
            minWidth="155px"
            fontWeight="500"
            onClick={connect}
            fontSize="12px"
            mr={2}
          >
            Connect Wallet
          </GradientOutlinedButton>
        )}
        <Icon iconSrc="assets/images/Navbar/navbar_right_icon.svg" width="30" height="30" hoverable></Icon>
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
              iconLeft="assets/images/navbar/navbar_bright_logo_v1.3.svg"
              fontSize="12px"
              fontWeight="500"
              iconLeftWidth={16}
              iconLeftHeight={16}
              mb={2}
            >
              {connectBrightButtonLabel}
            </BrightConnectedButton>
          ) : (
            <BrightPrimaryButton
              data-testid="brightid-show-modal"
              mb={2}
              disabled={!account}
              fontSize="12px"
              fontWeight="800"
              minWidth="150px"
              onClick={() => {
                if (userProfile && userProfile.verificationStatus === BrightIdVerificationStatus.PENDING) {
                  openBrightIdModal();
                }
              }}
            >
              {connectBrightButtonLabel}
            </BrightPrimaryButton>
          )}
          {active ? (
            <LightOutlinedButton>{shortenAddress(account)}</LightOutlinedButton>
          ) : (
            <GradientOutlinedButton onClick={connect}>Connect Wallet</GradientOutlinedButton>
          )}
        </div>
      </MobileNav>
    </NavbarWrapper>
  );
};

export default Navbar;
