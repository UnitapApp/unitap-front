import React, { useCallback, useContext } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { ClaimButton, ClaimedButton, SecondaryButton } from 'components/basic/Button/button';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { ChainListContext } from 'hooks/useChainList';
import { fromWei } from 'utils/numbers';
import { useAddAndSwitchToChain } from 'hooks/useAddAndSwitchToChain';
import { getChainIcon } from '../../../../utils';
import Icon from 'components/basic/Icon/Icon';

// ###### Local Styled Components

const ChainCard = styled.div`
  width: 100%;
  gap: 18px;
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
    flex: 2;

    span {
      color: ${DV.colors.gray};
      padding-right: ${DV.sizes.baseMargin * 1.5}px;
      font-size: 14px;
    }

    &:first-child {
      margin-right: ${DV.sizes.baseMargin * 8}px;
    }
  }

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    flex-direction: column;
    padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px;
  }
`;

const ChainLogo = styled.div`
  background-color: ${DV.colors.black};
  height: 101%;
  width: 48px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${DV.sizes.baseRadius * 1.5}px 0 0 ${DV.sizes.baseRadius * 1.5}px;
  left: -1px;
  bottom: -1px;

  img {
    width: 30px;
    height: 30px;
  }

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    position: relative;
    height: 64px;
    width: 64px;
    bottom: unset;
    border-radius: 32px;
  }
`;

const ChainName = styled.div`
  flex: 3;
  color: white;
  margin-left: ${DV.sizes.baseMargin * 4}px;
  //width: 300px;
  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    text-align: center;
    margin: 0;
  }
`;

const Action = styled.div`
  flex: 5;
  display: flex;
  align-items: center;
  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
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

const AddMetamaskButton = styled(SecondaryButton)`
  padding-top: 12px;
  padding-bottom: 12px;
`;

const ChainListWrapper = styled.div`
  padding: ${DV.sizes.baseRadius * 3}px 0;
  width: 100%;
`;

const ChainList = () => {
  const { chainList, chainListSearchResult, openClaimModal } = useContext(ChainListContext);

  const { addAndSwitchToChain } = useAddAndSwitchToChain();
  const { active } = useActiveWeb3React();

  const formatBalance = useCallback((amount: number) => {
    const fw = fromWei(amount);
    return Number(fw) < 0.000001 ? '< 0.000001' : fw;
  }, []);

  const windowSize = window.innerWidth;

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
                  <img src={getChainIcon(chain)} alt="" />
                </ChainLogo>
                <ChainName data-testid={`chain-name-${chain.pk}`}>{chain.chainName}</ChainName>
                <p>
                  <span>Chain ID</span> {chain.chainId}
                </p>
                <p>
                  <span>Currency</span> {chain.symbol}
                </p>
                <Action>
                  {/* to-do migrate buttom logic*/}
                  {chain.unclaimed !== 0 ? (
                    <ClaimButton
                      data-testid={`chain-show-claim-${chain.pk}`}
                      disabled={!active}
                      mr={2}
                      mlAuto
                      onClick={() => openClaimModal(chain)}
                    >
                      {`Claim ${formatBalance(chain.maxClaimAmount)} ${chain.symbol}`}
                    </ClaimButton>
                  ) : (
                    <ClaimedButton
                      data-testid={`chain-claimed-${chain.pk}`}
                      mr={2}
                      mlAuto
                      icon="claimIcon.png"
                      iconWidth={52}
                      iconHeight={58}
                    >
                      Claimed!
                    </ClaimedButton>
                  )}

                  <AddMetamaskButton
                    data-testid={`chain-switch-${chain.pk}`}
                    onClick={() => addAndSwitchToChain(chain)}
                    disabled={!active}
                  >
                    Add to MetaMask
                  </AddMetamaskButton>
                </Action>
              </ChainCard>
            </div>
          );
        })}
        {chainListSearchResult.length === 0 && chainList.length && (
          <Icon
            iconSrc={
              windowSize > 992 ? 'assets/images/claim/empty-list.svg' : 'assets/images/claim/empty-list-mobile.svg'
            }
            width="100%"
          />
        )}
      </div>
    </ChainListWrapper>
  );
};

export default ChainList;
