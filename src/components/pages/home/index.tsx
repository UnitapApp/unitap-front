import React, { useState, FC } from 'react';

import { Button } from 'components/basic/Button/button';
import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';

import { DV } from 'components/basic/designVariables';
import styled from 'styled-components/';
import Header from 'components/pages/home/components/Header/header';

const NavWrapper = styled.div`
  position: absolute;
  width: 100%;
`;
const ChainListWrapper = styled.div`
  padding: ${DV.sizes.baseRadius * 8}px ${DV.sizes.baseRadius * 4}px;
`;

const Home: FC = ({ children }) => {
  const [chainList, setChainList] = useState([
    {
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022',
      name: 'Polygon Mainnet',
      chain_id: 137,
      symbol: 'MATIC',
    },
    {
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022',
      name: 'Polygon Mainnet',
      chain_id: 1,
      symbol: 'MATIC',
    },
    {
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022',
      name: 'Polygon Mainnet',
      chain_id: 7,
      symbol: 'MATIC',
    },
  ]);
  console.log(chainList);
  return (
    <>
      <div>
        <NavWrapper>
          <Navbar />
        </NavWrapper>
        <Header />
        <ChainListWrapper>
          <ChainList data={chainList} />
        </ChainListWrapper>
      </div>
    </>
  );
};

export default Home;
