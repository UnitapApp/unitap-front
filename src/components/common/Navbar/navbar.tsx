import React, { useContext, useMemo, useState } from 'react';
import {
  BrightConnectedButton,
  BrightPrimaryButton,
  GradientOutlinedButton,
  LightOutlinedButton,
  PrimaryOutlinedButton,
} from 'components/basic/Button/button';
import { UserProfileContext } from 'hooks/useUserProfile';
import { BrightIdVerificationStatus } from 'types';
import { shortenAddress } from 'utils';
import { DesktopNav, MobileNav } from './navbar.style';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RoutePath from 'routes';
import { ClaimContext } from 'hooks/useChainList';
import useWalletActivation from '../../../hooks/useWalletActivation';
import { useWeb3React } from '@web3-react/core';
import Icon from 'components/basic/Icon/Icon';
import NavbarDropdown from './navbarDropdown';

const Navbar = () => {
  const { tryActivation } = useWalletActivation();

  const { openBrightIdModal } = useContext(ClaimContext);
  const { account, chainId } = useWeb3React();
  const active = !!account;

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

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisibleTimeout, setIsDropdownVisibleTimeout] = useState<NodeJS.Timeout | null>(null)

  const showDropdown = () => {
    if (isDropdownVisibleTimeout) {
      clearTimeout(isDropdownVisibleTimeout);
    }
    setIsDropdownVisible(true);
  };

  const hideDropdown = () => {
    let timeout = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 500);
    setIsDropdownVisibleTimeout(timeout);
  };

  return (
    <div className="navbar w-[100%] fixed flex items-center top-0 z-100 bg-gray10 py-3 px-8">
      <Icon
        className="navbar__logo cursor-pointer"
        iconSrc="assets/images/navbar/navbar_logo_v1.3.svg"
        width="140px"
        height="32px"
        mrAuto
        onClick={() => navigate(RoutePath.LANDING)}
      />
      {process.env.REACT_APP_IS_CYPRESS === 'true' && <span data-testid="chain-id">{chainId}</span>}
      <DesktopNav>
        {location.pathname === RoutePath.FUND && (
          <Link to={RoutePath.FAUCET}>
            <PrimaryOutlinedButton mr={2} minWidth="175px">
              Claim Gas Fee
            </PrimaryOutlinedButton>
          </Link>
        )}
        {active ? (
          userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED ? (
            <>
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
              <LightOutlinedButton
                data-testid="wallet-connect"
                minWidth="155px"
                fontSize="12px"
                fontWeight="400"
                mr={2}
              >
                {shortenAddress(account)}
              </LightOutlinedButton>
            </>
          ) : (
            <>
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
              <LightOutlinedButton
                data-testid="wallet-connect"
                minWidth="155px"
                fontSize="12px"
                fontWeight="400"
                mr={2}
              >
                {shortenAddress(account)}
              </LightOutlinedButton>
            </>
          )
        ) : (
          <GradientOutlinedButton
            data-testid="wallet-connect"
            minWidth="155px"
            fontWeight="500"
            onClick={tryActivation}
            fontSize="12px"
            mr={2}
          >
            Connect Wallet
          </GradientOutlinedButton>
        )}
        <span
          className="navbar__dropdown cursor-pointer"
          onMouseEnter={() => showDropdown()}
          onMouseLeave={() => hideDropdown()}
          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          <Icon iconSrc="assets/images/Navbar/navbar_right_icon.svg" width="30" height="30"></Icon>
          {isDropdownVisible && (
            <NavbarDropdown
              className="navbar__dropdown__component"
              onMouseEnter={() => showDropdown()}
              onMouseLeave={() => hideDropdown()}
            />
          )}
        </span>
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
            <GradientOutlinedButton onClick={tryActivation}>Connect Wallet</GradientOutlinedButton>
          )}
        </div>
      </MobileNav>
    </div>
  );
};

export default Navbar;
