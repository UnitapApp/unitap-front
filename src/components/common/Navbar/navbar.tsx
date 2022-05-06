import React, { useContext } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { BrightOutlinedButton, LightOutlinedButton } from 'components/basic/Button/button';
import Modal from 'components/common/Modal/modal';
import BrightConnectionModal from 'components/pages/home/components/BrightConnectionModal/brightConnectionModal';
import { Spaceman } from 'constants/spaceman';
import { UserProfileContext } from '../../../hooks/useUserProfile';
import { BrightIdVerificationStatus } from '../../../types';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import { shortenAddress } from '../../../utils';

// ###### Local Styled Components

const Nav = styled.div`
  display: flex;
  border-radius: ${DV.sizes.baseRadius * 1.5};
  background-color: rgba(21, 21, 27, 0.7);
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px;

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

  const {userProfile} = useContext(UserProfileContext);
  return (
    <Nav>
      <img src="logo.png" alt="" />
      {userProfile && (
        <BrightOutlinedButton
          data-testid="brightid-show-modal"
          mr={2}
          onClick={() => {
            if (userProfile.verificationStatus === BrightIdVerificationStatus.PENDING) {
              changeModalActive(true);
            }
          }}
        >
          {userProfile.verificationStatus === BrightIdVerificationStatus.VERIFIED
            ? 'BrightID Connected'
            : 'Connect BrightID'}
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
        <BrightConnectionModal />
      </Modal>
    </Nav>
  );
};

export default Navbar;
