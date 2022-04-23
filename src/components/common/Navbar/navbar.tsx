import React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { LightOutlinedButton, BrightOutlinedButton } from 'components/basic/Button/button';
import Modal from 'components/common/Modal/modal';
import BrightConnectionModal from 'components/pages/home/components/BrightConnectionModal/brightConnectionModal';
import { Spaceman } from 'constants/spaceman';

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

const Navbar = () => {
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false);
  const changeModalActive = (state: boolean) => {
    setIsModalActive(state);
  };

  return (
    <Nav>
      <img src="logo.png" alt="" />
      <BrightOutlinedButton
        mr={2}
        onClick={() => {
          changeModalActive(true);
        }}
      >
        Connected to BrightID
      </BrightOutlinedButton>
      <LightOutlinedButton>Add to MetaMask</LightOutlinedButton>

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
