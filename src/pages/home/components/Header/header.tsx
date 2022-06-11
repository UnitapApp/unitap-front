import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import Input from 'components/basic/Input/input';
import Icon from 'components/basic/Icon/Icon';
import { ChainListContext } from 'hooks/useChainList';
import { diffToNextMonday } from '../../../../utils';

// ###### Local Styled Components

const HeaderComp = styled.div`
  display: flex;
  background-image: url('/headerBg.png');
  background-size: cover;
  height: 170px;
  background-size: cover;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media only screen and (max-width: 1200px) {
    height: calc(175px + (${DV.sizes.baseMargin * 6}px));
  }
`;

const Timer = styled.div`
  position: absolute;
  top: ${DV.sizes.baseMargin * 2.3}px;
  color: white;
  opacity: 1;
  z-index: 10;

  font-family: 'Open Sans';
  font-size: 24px;

  @media only screen and (max-width: 1200px) {
    height: calc(175px + (${DV.sizes.baseMargin * 10}px));
    top: ${DV.sizes.baseMargin * 10}px;
  }

  span {
    margin: auto ${DV.sizes.baseMargin}px;
  }
`;

const Drops = styled.span`
  position: relative;
  width: 100%;
  height: 100%;

  & > * {
    position: absolute;
    filter: blur(1px);
  }

  .first_drop {
    right: 7vw;
    top: 60%;
  }
  .second_drop {
    right: 40vw;
    top: 50%;
    transform: rotate(5deg);
  }
  .third_drop {
    left: 40vw;
    top: 47%;
    transform: rotate(-20deg);
  }
  .forth_drop {
    left: 5vw;
    top: 50%;
    transform: rotate(-25deg);
  }
`;

const Spaceman = styled.div`
  position: absolute;
  bottom: -90px;
  @media screen and (max-width: 920px) {
    display: none;
  }
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
    const diff = diffToNextMonday(now);
    setSeconds(diff.seconds);
    setMinutes(diff.minutes);
    setHours(diff.hours);
    setDays(diff.days);
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
        <Spaceman>
          <Icon iconSrc={'assets/images/claim/spaceman-header.svg'} width="170px" height="auto" />
        </Spaceman>
        <Drops>
          <Icon iconSrc="assets/images/claim/drop.svg" width="19px" height="auto" className='first_drop'></Icon>
          <Icon iconSrc="assets/images/claim/drop.svg" width="20px" height="auto" className='second_drop'></Icon>
          <Icon iconSrc="assets/images/claim/drop.svg" width="23px" height="auto" className='third_drop'></Icon>
          <Icon iconSrc="assets/images/claim/drop.svg" width="18px" height="auto" className='forth_drop'></Icon>
        </Drops>
      </HeaderComp>
      <InputWrapper>
        <Input
          data-testid="search-box"
          icon="search.png"
          width="min(500px, 90%)"
          iconWidth="20px"
          iconHeight="20px"
          value={searchPhraseInput}
          onChange={searchPhraseChangeHandler}
          placeholder="Search Network / Currency"
          pl={7}
        ></Input>
      </InputWrapper>
    </>
  );
};

export default Header;
