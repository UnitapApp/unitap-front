import React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { GreenOutlinedButton, PrimaryOutlinedButton, SecondaryButton } from 'components/basic/Button/button';
import ClaimModal from '../ClaimModal/claimModal';
import Modal from 'components/common/Modal/modal';
import { Spaceman } from 'constants/spaceman';


import { useEffect, useState  } from 'react';
import { hooks, metaMask } from '../../../../../connectors/metaMask';

import type { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'


import { CHAINS, getAddChainParameters,URLS } from 'chains';
const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hooks


// ###### Local Styled Components

const ChainCard = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${DV.colors.black};
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  background-color: #1e1e29;
  margin-bottom: ${DV.sizes.baseMargin * 2}px;
  padding: ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 6}px;

  img {
    width: 30px;
    position: absolute;
    padding: 38px ${DV.sizes.baseMargin * 1.5}px;
    display: flex;
    border-radius: ${DV.sizes.baseRadius * 1.5}px 0 0 ${DV.sizes.baseRadius * 1.5}px;
    left: -1px;
    bottom: 0;
    top: 1-px;
    background-color: ${DV.colors.black};
  }
  p {
    color: white;
    &:first-child {
      margin-right: ${DV.sizes.baseMargin * 8}px;
    }
  }
`;
const ChainName = styled.p`
  margin-left: ${DV.sizes.baseMargin * 6}px;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
`;

// ###### Local Interfaces
interface chainObj {
  icon: string;
  name: string;
  chain_id: number;
  symbol: string;
}

const ChainList = (data: any) => {
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false);
  const changeModalActive = (state: boolean) => {
    setIsModalActive(state);
  };

  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly()
  }, [])
  
  const connector: MetaMask | WalletConnect | Network = metaMask; 

  const isNetwork = connector instanceof Network;
  const displayDefault = !isNetwork;
  const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map((chainId) => Number(chainId))

  const [desiredChainId, setDesiredChainId] = useState<number>(isNetwork ? 1 : -1)


  return (
    <div>
      {chainIds.map((chainId) => {
        return (
          <>
            <ChainCard key={chainId}>
              <img src={data.data[0].icon} alt="" />
              <ChainName>{CHAINS[chainId]?.name }</ChainName>
              <p>
                <span>Chain ID</span> {chainId}
              </p>
              <p>
                <span>Currency</span> {data.data[0].symbol}
              </p>
              <Action>
                <PrimaryOutlinedButton
                  mr={2}
                  onClick={() => {
                    changeModalActive(true);
                  }}
                >
                  Claim 0.003 MATIC
                </PrimaryOutlinedButton>
                <SecondaryButton
                onClick={
                  isActivating
                    ? undefined
                    : () =>
                      // connector instanceof WalletConnect || connector instanceof Network
                      //   ? connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
                      //   : 
                        connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
                }
                disabled={isActivating}
                >Add to MetaMask</SecondaryButton>
              </Action>
            </ChainCard>
            <Modal
              spaceman={Spaceman.BOTTOM_BIG}
              title="claim gas fee"
              isOpen={isModalActive}
              closeModalHandler={() => {
                changeModalActive(false);
              }}
            >
              <ClaimModal />
            </Modal>
          </>
        );
      })}
    </div>
  );
};

export default ChainList;
