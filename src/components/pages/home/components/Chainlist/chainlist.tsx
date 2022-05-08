import React, { useCallback, useContext } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { PrimaryOutlinedButton, SecondaryButton } from 'components/basic/Button/button';
import { Chain } from '../../../../../types';
import { ethers } from 'ethers';
import { switchToNetwork } from '../../../../../utils/switchToNetwork';
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React';
import Modal from '../../../../common/Modal/modal';
import { Spaceman } from '../../../../../constants/spaceman';
import ClaimModal from '../ClaimModal/claimModal';
import { ChainListContext } from '../../../../../hooks/useChainList';

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
    span {
      color: ${DV.colors.gray};
      padding-right: ${DV.sizes.baseMargin * 1.5}px;
      font-size: 14px;
    }
    &:first-child {
      margin-right: ${DV.sizes.baseMargin * 8}px;
    }
  }
`;
const ChainName = styled.p`
  margin-left: ${DV.sizes.baseMargin * 6}px;
  width: 300px;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
`;
export const ClaimButton = styled(PrimaryOutlinedButton)`
  width: 220px;
`;

const ChainListWrapper = styled.div`
  padding: ${DV.sizes.baseRadius * 8}px ${DV.sizes.baseRadius * 4}px;
`;
const ChainList = () => {
  const { chainList } = useContext(ChainListContext);

  const [activeChain, setActiveChain] = React.useState<Chain | null>(null);

  const { library, active } = useActiveWeb3React();

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
    [active, library],
  );

  return (
    <ChainListWrapper>
      <div>
        {chainList.map((chain) => {
          return (
            <div key={chain.chainId}>
              <ChainCard>
                <img src={chain.logoUrl} alt="" />
                <ChainName data-testid={`chain-name-${chain.pk}`}>{chain.chainName}</ChainName>
                <p>
                  <span>Chain ID</span> {chain.chainId}
                </p>
                <p>
                  <span>Currency</span> {chain.symbol}
                </p>
                <Action>
                  <ClaimButton
                    data-testid={`chain-show-claim-${chain.pk}`}
                    disabled={!active}
                    mr={2}
                    onClick={() => {
                      if (chain.unclaimed !== 0) {
                        setActiveChain(chain);
                      }
                    }}
                  >
                    {chain.unclaimed === 0
                      ? 'Claimed!'
                      : `Claim ${formatBalance(chain.maxClaimAmount)} ${chain.symbol}`}
                  </ClaimButton>
                  <SecondaryButton
                    data-testid={`chain-switch-${chain.pk}`}
                    onClick={() => changeNetwork(chain)}
                    disabled={!active}
                  >
                    Add to MetaMask
                  </SecondaryButton>
                </Action>
              </ChainCard>
            </div>
          );
        })}
      </div>

      <Modal
        spaceman={Spaceman.BOTTOM_BIG}
        title="claim gas fee"
        isOpen={!!activeChain}
        closeModalHandler={() => {
          setActiveChain(null);
        }}
      >
        {activeChain && (
          <ClaimModal
            chain={activeChain}
            closeModalHandler={() => {
              setActiveChain(null);
            }}
          />
        )}
      </Modal>
    </ChainListWrapper>
  );
};

export default ChainList;
