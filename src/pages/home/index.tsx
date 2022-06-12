import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import Header from 'pages/home/components/Header/header';
import Footer from '../../components/common/Footer/footer';
import ProvideGasCard from './components/ProvideGasCard/provideGasCard';
import Input from 'components/basic/Input/input';

import { Body } from 'components/common/Body/body';
import { ChainListContext } from 'hooks/useChainList';
import { DV } from 'components/basic/designVariables';
import { diffToNextMonday } from 'utils';
import { Text } from 'components/basic/Text/text.style';
import Icon from 'components/basic/Icon/Icon';

const HomeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${DV.sizes.basePadding * 4.5}px ${DV.sizes.basePadding * 11.25}px;
`;

interface rowProps {
  mdReverse?: boolean
}

const Row = styled.div<rowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    flex-direction: ${({mdReverse}) => mdReverse ? `column-reverse` : 'row'};
  }
`;

interface props {
  xlg?: number;
  lg?: number;
  md?: number;
  xs?: number;
}

const Col = styled.div<props>`
  width: ${({ xlg }) => (xlg ? `${(xlg * 100) / 12}%` : '100%')};

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    width: ${({ lg }) => (lg ? `${(lg * 100) / 12}%` : '100%')};
  }
  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    width: ${({ md }) => (md ? `${(md * 100) / 12}%` : '100%')};
  }
  @media only screen and (max-width: ${DV.breakpoints.mobile}) {
    width: ${({ xs }) => (xs ? `${(xs * 100) / 12}%` : '100%')};
  }
`;

const TimerWrapper = styled.div`
  font-family: 'Open Sans';
  background: #1e1e29;
  border: 1px solid #1b1b26;
  border-radius: 8px;
  align-self: flex-end;
  display: flex;
  margin-left: auto;
  width: fit-content;
  align-items: center;
  padding: ${DV.sizes.basePadding}px ${DV.sizes.basePadding * 6}px ${DV.sizes.basePadding}px
    ${DV.sizes.basePadding * 3}px;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    margin: 0 auto 1rem;
  } 
`;

const Timer = () => {
  const [now, setNow] = useState(new Date());
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
    <TimerWrapper>
      <Text color="gray" fontSize="12" mb={0} mr={3}>
        next launch in
      </Text>
      <Text color="white" fontSize="24" mb={0}>
        {days}:{hours}:{minutes}:{seconds}
      </Text>
    </TimerWrapper>
  );
};

const SearchInputWrapper = styled.div`
  position: relative;
  border: 1px solid ${DV.colors.gray};
  border-radius: ${DV.sizes.baseRadius}px;

  .icon-right {
    position: absolute;
    right: ${DV.sizes.basePadding * 2}px;
    top: ${DV.sizes.basePadding * 1.5}px;
    z-index: 10;
  }
`;

const SearchInput = () => {
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>('');
  const { changeSearchPhrase } = useContext(ChainListContext);

  const searchPhraseChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
    changeSearchPhrase!(phrase);
  };

  return (
    <SearchInputWrapper>
      <Input
        data-testid="search-box"
        icon="search.png"
        width="100%"
        fontSize='14px'
        iconWidth="20px"
        iconHeight="20px"
        value={searchPhraseInput}
        onChange={searchPhraseChangeHandler}
        placeholder="Search Network / Currency"
        pl={7}
        p={2}
        mb={0}
      ></Input>
      <Icon iconSrc="assets/images/claim/slash-icon.svg" hoverable className="icon-right"></Icon>
    </SearchInputWrapper>
  );
};

const Home = () => {
  return (
    <>
      <Navbar />
      <Body>
        <Header />
        <HomeContentWrapper>
          <Row mdReverse>
            <Col xs={12} md={12} lg={5.5} xlg={4}>
              <SearchInput />
            </Col>
            <Col xs={0} md={0} lg={0.5} xlg={3.5}></Col>
            <Col xs={12} md={12} lg={6} xlg={4.5}>
              <Timer />
            </Col>
          </Row>
          <ChainList />
          <ProvideGasCard />
        </HomeContentWrapper>
      </Body>
      <Footer />
    </>
  );
};

export default Home;
