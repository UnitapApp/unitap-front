import React from 'react';
import styled from 'styled-components/'
import { DV } from 'components/basic/designVariables'
import { PrimaryOutlinedButton, PrimaryButton, BrightOutlinedButton } from 'components/basic/Button/button';



// ###### Local Styled Components 

const HeaderComp = styled.div`
    display: flex;
    background-image: url('/headerBg.png');
    height: 300px;
    justify-content: center;
    align-items: center;
    p {
        position: relative;
        top: 24px;
        font-weight: bold;
        font-size: 24px;
        color: white;
    }
`

const Header = () => {
    return ( 
        <HeaderComp>
            <p>Add EVM networks easily and<br/> connect your BrightID to claim Gas Fee.</p>
        </HeaderComp>
     );
}
 
export default Header;