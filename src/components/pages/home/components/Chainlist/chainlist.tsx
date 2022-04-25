import React, { useCallback } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { PrimaryOutlinedButton, SecondaryButton } from 'components/basic/Button/button';
import ClaimModal from '../ClaimModal/claimModal';
import Modal from 'components/common/Modal/modal';
import { Spaceman } from 'constants/spaceman';
import { Chain } from '../../../../../types';
import { ethers } from 'ethers';
import { switchToNetwork } from '../../../../../utils/switchToNetwork';
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React';

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
    top: 1 -px;
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

const ChainList = ({ data }: { data: Chain[] }) => {
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false);
  const changeModalActive = (state: boolean) => {
    setIsModalActive(state);
  };

  const { chainId, library, active } = useActiveWeb3React();

  const formatBalance = useCallback((amount: number) => {
    const fw = ethers.utils.formatEther(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);

  const changeNetwork = useCallback(
    async (chain: Chain) => {
      if (!library?.provider) return;
      if (!active) return;
      await switchToNetwork({ provider: library.provider, chain });
    },
    [active, chainId, library],
  );

  return (
    <div>
      {data.map((chain) => {
        return (
          <div key={chain.chainId}>
            <ChainCard>
              <img src="https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022" alt="" />
              <ChainName>{chain.chainName}</ChainName>
              <p>
                <span>Chain ID</span> {chain.chainId}
              </p>
              <p>
                <span>Currency</span> {chain.symbol}
              </p>
              <Action>
                <PrimaryOutlinedButton
                  mr={2}
                  onClick={() => {
                    changeModalActive(true);
                  }}
                >
                  Claim {formatBalance(chain.maxClaimAmount)} {chain.symbol}
                </PrimaryOutlinedButton>
                <SecondaryButton onClick={() => changeNetwork(chain)} disabled={!active}>
                  Add to MetaMask
                </SecondaryButton>
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
          </div>
        );
      })}
    </div>
  );
};

export default ChainList;
