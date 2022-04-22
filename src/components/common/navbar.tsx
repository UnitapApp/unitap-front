import React from 'react';
import styled from 'styled-components/'
import { DV } from 'components/basic/designVariables'
import { PrimaryOutlinedButton, PrimaryButton, BrightOutlinedButton } from 'components/basic/button';



// ###### Local Styled Components 

const Nav = styled.div`
    display: flex;
    border-radius: ${DV.sizes.baseRadius * 1.5};
    background-color: rgba(21, 21, 27,0.7);
    padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px;
    img {
        width: 200px;
        margin-right: auto;
    }
`

const Navbar = () => {
    return ( 
        <Nav>
            <img src="logo.png" alt="" />
            <BrightOutlinedButton mr={2}>Connected to BrightID</BrightOutlinedButton>
            <PrimaryOutlinedButton>Add to MetaMask</PrimaryOutlinedButton>
        </Nav>
     );
}
 
export default Navbar;