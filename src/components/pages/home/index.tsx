import React, { FC, useEffect, useState } from 'react';
import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';

import { DV } from 'components/basic/designVariables';
import styled from 'styled-components/';
import Header from 'components/pages/home/components/Header/header';
import { Chain } from '../../../types';
import { getChainList } from '../../../api';

const NavWrapper = styled.div`
  position: absolute;
  width: 100%;
`;
const ChainListWrapper = styled.div`
  padding: ${DV.sizes.baseRadius * 8}px ${DV.sizes.baseRadius * 4}px;
`;

const Home: FC = ({ children }) => {
  const [chainList, setChainList] = useState<Chain[]>([]);
  useEffect(() => {
    let mounted = true;
    const fun = async () => {
      const newChainList = await getChainList();
      if (mounted) {
        setChainList(newChainList);
      }
    };

    fun();
    return () => {
      mounted = false;
    };
  }, []);
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
