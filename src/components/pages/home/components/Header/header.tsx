import React, { useState, useContext } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { Input } from 'components/basic/Input/input';
import Icon from 'components/basic/Icon/Icon';
import { ChainListContext } from 'hooks/useChainList';

// ###### Local Styled Components

const HeaderComp = styled.div`
  display: flex;
  background-image: url('/headerBg.png');
  height: 300px;
  background-size: cover;
  justify-content: center;
  align-items: center;
  position: relative;

  p {
    position: relative;
    text-align: center;
    top: 24px;
    font-weight: bold;
    font-size: 24px;
    color: white;
  }
`

const Spaceman = styled.div`
  position: absolute;
  right: 96px;
  bottom: -16px;
`


const GemRight = styled.div`
  position: absolute;
  right: 96px;
  top: 96px;
`

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled(FlexWrapper)`
  position: relative;
  bottom: ${DV.sizes.baseMargin * 2}px;
`;
const Header = () => {
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>("");
  const { chageSearchPhrase } = useContext(ChainListContext);

  const searchPhraseChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phrase:string = event.target.value;
    setSearchPhraseInput(phrase);
    chageSearchPhrase!(phrase);
  };
  return (
    <>
      <HeaderComp>
        <GemRight><Icon iconSrc={'headerBg/gem-1.png'} /></GemRight>
        <Spaceman><Icon iconSrc={'spman-header.png'} width="320px" height="auto" /></Spaceman>
        <p>
          Add EVM networks easily and
          <br /> connect your BrightID to claim Gas Fee.
        </p>
      </HeaderComp>
      <InputWrapper>
        {' '}
        <Input width="360px" placeholder="Search Network / Currency" value={searchPhraseInput} onChange={searchPhraseChangeHandler}></Input>{' '}
      </InputWrapper>
    </>
  );
};

export default Header;
