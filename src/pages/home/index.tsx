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

const HomeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${DV.sizes.basePadding * 4.5}px ${DV.sizes.basePadding * 11.25}px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

interface props {
  md?: number;
  xs?: number;
}

const Col = styled.div<props>`
  width: ${({ md }) => (md ? `${(md * 100) / 12}%` : '100%')};

  @media only screen and (max-width: ${DV.breakpoints.desktop}) {
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

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled(FlexWrapper)`
  position: relative;
`;

const Search = () => {
  const [searchPhraseInput, setSearchPhraseInput] = useState<string>('');
  const { changeSearchPhrase } = useContext(ChainListContext);

  const searchPhraseChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phrase: string = event.target.value;
    setSearchPhraseInput(phrase);
    changeSearchPhrase!(phrase);
  };

  return (
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
  );
};

const Home = () => {
  return (
    <>
      <Navbar />
      <Body>
        <Header />
        <HomeContentWrapper>
          <Row>
            <Col xs={12} md={6}>
              <Search />
            </Col>
            <Col xs={12} md={6}>
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
