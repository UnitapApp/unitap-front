import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import Input from 'components/basic/Input/input';
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
    @media screen and (max-width: 600px) {
      width: 90%;
      font-size: 20px;
    }
  }
`;

const Timer = styled.div`
  position: absolute;
  top: ${DV.sizes.baseMargin * 2.5}px;
  font-size: 28px;
  color: white;
  opacity: 1;
  z-index: 10000;

  span {
    margin: auto ${DV.sizes.baseMargin}px;
  }
`;

const Spaceman = styled.div`
  position: absolute;
  right: 96px;
  bottom: -16px;
  @media screen and (max-width: 920px) {
    display: none;
  }
`;

const GemRight = styled.div`
  position: absolute;
  right: 96px;
  top: 96px;
`;

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
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>('');
  const { changeSearchPhrase } = useContext(ChainListContext);
  const [now, setNow] = useState(new Date());
  const searchPhraseChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
    changeSearchPhrase!(phrase);
  };
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    const weekDay = now.getDay();
    const diffToMonday = 7 - (weekDay === 0 ? 7 : weekDay) + 1;
    const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    const diffTime = Math.ceil((nextMonday.getTime() - now.getTime()) / 1000);
    setSeconds(String(diffTime % 60).padStart(2, '0'));
    setMinutes(String(Math.floor(diffTime / 60) % 60).padStart(2, '0'));
    setHours(String(Math.floor(diffTime / 3600) % 24).padStart(2, '0'));
    setDays(String(Math.floor(diffTime / 86400)).padStart(2, '0'));
  }, [now]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <HeaderComp>
        <Timer>
          <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </Timer>
        <GemRight>
          <Icon iconSrc={'headerBg/gem-1.png'} />
        </GemRight>
        <Spaceman>
          <Icon iconSrc={'spman-header.png'} width="320px" height="auto" />
        </Spaceman>
        <p>
          Add EVM networks easily and
          <br /> connect your BrightID to claim Gas Fee.
        </p>
      </HeaderComp>
      <InputWrapper>
        {' '}
        <Input
          testid="search-box"
          icon="search.png"
          width="min(500px, 90%)"
          iconWidth="20px"
          iconHeight="20px"
          value={searchPhraseInput}
          onChange={searchPhraseChangeHandler}
          placeholder="Search Network / Currency"
        ></Input>{' '}
      </InputWrapper>
    </>
  );
};

export default Header;
