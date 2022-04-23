import React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { LightOutlinedButton, BrightOutlinedButton } from 'components/basic/button';
import Modal from 'components/basic/Modal/modal';
import BrightConnectionModal from 'components/common/brightConnectionModal';
import { Spaceman } from 'constants/spaceman';

// ###### Local Styled Components

const Nav = styled.div`
  display: flex;
  border-radius: ${DV.sizes.baseRadius * 1.5};
  background-color: rgba(21, 21, 27, 0.7);
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px;
  img {
    width: 200px;
    margin-right: auto;
  }
`;

const Navbar = () => {
  const [modalIsActive, setModalIsActive] = React.useState<boolean>(false);
  const showBrightConnectionModal = () => {
    setModalIsActive(true);
  };

  const closeBrightConnectionModal = () => {
    setModalIsActive(false);
  }

  return (
    <Nav>
      <img src="logo.png" alt="" />
      <BrightOutlinedButton
        mr={2}
        onClick={() => {
          showBrightConnectionModal();
        }}
      >
        Connected to BrightID
      </BrightOutlinedButton>
      <LightOutlinedButton>Add to MetaMask</LightOutlinedButton>

      <Modal
        spaceman={Spaceman.BOTTOM_BIG}
        title="connect bright id"
        isOpen={modalIsActive}
        closeModalHandler={closeBrightConnectionModal}
      >
        <BrightConnectionModal />
      </Modal>
    </Nav>
  );
};

export default Navbar;
