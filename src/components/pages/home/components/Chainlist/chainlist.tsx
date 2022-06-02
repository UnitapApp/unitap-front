import React, { useCallback, useContext } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { ClaimButton, ClaimedButton, SecondaryButton } from 'components/basic/Button/button';
import { Chain } from 'types';
import { switchToNetwork } from 'utils/switchToNetwork';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import Modal from 'components/common/Modal/modal';
import { Spaceman } from 'constants/spaceman';
import ClaimModal from 'components/pages/home/components/ClaimModal/claimModal';
import { ChainListContext } from 'hooks/useChainList';
import { fromWei } from '../../../../../utils/numbers';

// ###### Local Styled Components

const ChainCard = styled.div`
  max-width: 1280px;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${DV.colors.black};
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  background-color: #1d1d29;
  margin-bottom: ${DV.sizes.baseMargin * 2}px;
  padding: ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 6}px;

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

  @media only screen and (max-width: 1224px) {
    flex-direction: column;
    padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px;
  }
`;

const ChainLogo = styled.div`
  background-color: ${DV.colors.black};
  height: 102px;
  width: 48px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${DV.sizes.baseRadius * 1.5}px 0 0 ${DV.sizes.baseRadius * 1.5}px;
  left: -1px;
  bottom: 0;

  img {
    width: 30px;
    height: 30px;
  }

  @media only screen and (max-width: 1224px) {
    position: relative;
    height: 64px;
    width: 64px;
    left: 12px;
    bottom: unset;
    top: 12px;
    border-radius: 32px;
  }
`;

const ChainName = styled.p`
  margin-left: ${DV.sizes.baseMargin * 6}px;
  width: 300px;
  @media only screen and (max-width: 1224px) {
    text-align: center;
    margin-left: 0;
    width: 100%;
  }
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  @media only screen and (max-width: 1224px) {
    flex-direction: column;
    width: 100%;
    button {
      margin-right: 0 !important;
      display: block;
      width: 100%;

      &:first-child {
        margin-bottom: ${DV.sizes.baseMargin * 2}px;
      }
    }
  }
`;

const ChainListWrapper = styled.div`
  padding: ${DV.sizes.baseRadius * 4}px ${DV.sizes.baseRadius * 4}px;
`;
const ChainList = () => {
  const { chainList, chainListSearchResult } = useContext(ChainListContext);

  const [activeChain, setActiveChain] = React.useState<Chain | null>(null);

  const { library, active } = useActiveWeb3React();

  const formatBalance = useCallback((amount: number) => {
    const fw = fromWei(amount);
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
        {!chainList.length && (
          <div style={{ color: 'white', textAlign: 'center' }} data-testid="chain-list-loading">
            Loading...
          </div>
        )}
        {chainListSearchResult.map((chain) => {
          return (
            <div key={chain.chainId}>
              <ChainCard>
                <ChainLogo>
                  <img src={`${process.env.PUBLIC_URL}/assets/chains/${chain.chainId}.svg`} alt="" />
                </ChainLogo>
                <ChainName data-testid={`chain-name-${chain.pk}`}>{chain.chainName}</ChainName>
                <p>
                  <span>Chain ID</span> {chain.chainId}
                </p>
                <p>
                  <span>Currency</span> {chain.symbol}
                </p>
                <Action>
                  {chain.unclaimed !== 0 ? (
                    <ClaimButton
                      data-testid={`chain-show-claim-${chain.pk}`}
                      disabled={!active}
                      mr={2}
                      onClick={() => {
                        setActiveChain(chain);
                      }}
                    >
                      {`Claim ${formatBalance(chain.maxClaimAmount)} ${chain.symbol}`}
                    </ClaimButton>
                  ) : (
                    <ClaimedButton
                      data-testid={`chain-claimed-${chain.pk}`}
                      mr={2}
                      icon="claimIcon.png"
                      iconWidth={52}
                      iconHeight={58}
                    >
                      Claimed!
                    </ClaimedButton>
                  )}

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
