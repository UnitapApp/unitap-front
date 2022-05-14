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
