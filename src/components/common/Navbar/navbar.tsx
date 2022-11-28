import React, { useContext, useMemo } from "react";
import {
  BrightConnectedButton,
  BrightOutlinedButton,
  LightOutlinedButton,
  PrimaryOutlinedButton
} from "components/basic/Button/button";
import { UserProfileContext } from "hooks/useUserProfile";
import { BrightIdVerificationStatus } from "types";
import { shortenAddress } from "utils";
import { DesktopNav, MobileNav, NavbarWrapper, NavLogo } from "./navbar.style";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoutePath from "routes";
import { ClaimContext } from "hooks/useChainList";
import useWalletActivation from "../../../hooks/useWalletActivation";
import { useWeb3React } from "@web3-react/core";

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
          ? "BrightID Connected"
          : "Connect BrightID";
      }
      return "Loading...";
    }
    return "Connect BrightID";
  }, [account, userProfile]);

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <NavbarWrapper>
      <NavLogo
        iconSrc="logo.svg"
        width="250px"
        height="40px"
        mrAuto
        onClick={() => navigate(RoutePath.LANDING)}
        style={{ cursor: "pointer" }}
      />
      {process.env.REACT_APP_IS_CYPRESS === "true" && <span data-testid="chain-id">{chainId}</span>}
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
            icon="green-tick.svg"
            fontSize="12px"
            fontWeight="normal"
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
            fontWeight="normal"
            minWidth="175px"
            mr={2}
            onClick={() => {
              if (userProfile && userProfile.verificationStatus === BrightIdVerificationStatus.PENDING) {
                openBrightIdModal();
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
          <LightOutlinedButton data-testid="wallet-connect" minWidth="175px" onClick={tryActivation} fontSize="12px">
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
            <BrightConnectedButton icon="green-tick.svg" iconWidth={24} iconHeight={16} mb={2}>
              {connectBrightButtonLabel}
            </BrightConnectedButton>
          ) : (
            <BrightOutlinedButton
              data-testid="brightid-show-modal"
              mb={2}
              disabled={!account}
              onClick={() => {
                if (userProfile && userProfile.verificationStatus === BrightIdVerificationStatus.PENDING) {
                  openBrightIdModal();
                }
              }}
            >
              {connectBrightButtonLabel}
            </BrightOutlinedButton>
          )}
          {active ? (
            <LightOutlinedButton>{shortenAddress(account)}</LightOutlinedButton>
          ) : (
            <LightOutlinedButton onClick={tryActivation}>Connect Wallet</LightOutlinedButton>
          )}
        </div>
      </MobileNav>
    </NavbarWrapper>
  );
};

export default Navbar;
