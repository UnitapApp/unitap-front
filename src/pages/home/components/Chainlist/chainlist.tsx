import React, { useContext } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { ClaimButton, ClaimedButton, SecondaryButton } from 'components/basic/Button/button';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { ClaimContext } from 'hooks/useChainList';
import { formatWeiBalance } from 'utils/numbers';
import { useAddAndSwitchToChain } from 'hooks/useAddAndSwitchToChain';
import { getChainIcon } from '../../../../utils';
import Icon from 'components/basic/Icon/Icon';

// ###### Local Styled Components

const ChainCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ChainCardTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${DV.sizes.baseRadius * 1.5}px ${DV.sizes.baseRadius * 1.5}px 0 0;
  background-color: #1e1e29;
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 2}px
    ${DV.sizes.basePadding * 1.5}px;

  p {
    color: white;
    flex: 2;
  }

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    flex-direction: column;
    padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px;
  }
`;

const ChainCardTopLeft = styled.div`
  display: flex;
  align-items: center;

  .chain-logo {
    width: 30px;
    height: 30px;
  }

  .arrow-icon {
    width: 8px;
    margin-left: ${DV.sizes.baseMargin * 0.5}px;
    margin-top: 1px;

    cursor: pointer;
  }
`;

const ChainCardTopRight = styled.div`
  display: flex;
  align-items: flex-end;
`;

const ChainCardBottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: #1b1b26;
  height: 40px;
  border-radius: 0 0 ${DV.sizes.baseRadius * 1.5}px ${DV.sizes.baseRadius * 1.5}px;
`;

const ChainCardInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChainCardInfoTitle = styled.div`
  color: #67677b;

  font-family: NotoSans;
  font-size: 14px;
  line-height: 19px;
`;

const ChainCardInfoValue = styled.div`
  color: white;
  margin-left: ${DV.sizes.baseMargin * 1.5}px;

  font-family: NotoSansMono;
  font-size: 14px;
  line-height: 19px;
`;

const ChainName = styled.div`
  flex: 3;
  color: white;
  margin-left: ${DV.sizes.baseMargin * 1.5}px;

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
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  background-color: #21212c;
  border: 2px solid #1b1b26;
  gap: ${DV.sizes.baseMargin * 1.5}px;
  min-height: 40px;

  img {
    width: 20px;
    height: 20px;
    transform: scale(1.3);
  }
`;

const ChainListWrapper = styled.div`
  padding: ${DV.sizes.baseRadius * 3}px 0;
  width: 100%;
`;

const ChainList = () => {
  const { chainList, chainListSearchResult, openClaimModal } = useContext(ClaimContext);

  const { addAndSwitchToChain } = useAddAndSwitchToChain();
  const { active } = useActiveWeb3React();

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
              <ChainCardTop>
                {/* <ChainLogo> */}
                <img src={getChainIcon(chain)} alt="" />
                {/* </ChainLogo> */}
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
                      mr={2}
                      mlAuto
                      onClick={() => openClaimModal(chain)}
                    >
                      {`Claim ${formatWeiBalance(chain.maxClaimAmount)} ${chain.symbol}`}
                    </ClaimButton>
                  ) : (
                    <ClaimedButton
                      data-testid={`chain-claimed-${chain.pk}`}
                      mr={2}
                      mlAuto
                      icon="claimIcon.png"
                      iconWidth={52}
                      iconHeight={58}
                      onClick={() => openClaimModal(chain)}
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
              </ChainCardTop>
            </div>
          );
        })}
        <div>
          <ChainCard>
            <ChainCardTop>
              <ChainCardTopLeft>
                <img
                  className="chain-logo"
                  src="https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png"
                  alt="polygon logo"
                />
                <ChainName>Polygon</ChainName>
                <img className="arrow-icon" src="assets/images/arrow-icon.svg" />
              </ChainCardTopLeft>
              <ChainCardTopRight>
                <AddMetamaskButton mr={2} disabled={!active}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                    alt="metamask logo"
                  />
                  Add
                </AddMetamaskButton>
                <Action>
                  {/* to-do migrate buttom logic*/}
                  {false ? (
                    <ClaimButton mlAuto>
                      <p>Claim 0.1 MATIC</p>
                    </ClaimButton>
                  ) : (
                    <ClaimedButton mlAuto icon="../assets/images/claim/claimedIcon.svg" iconWidth={24} iconHeight={20}>
                      <p>Claimed!</p>
                    </ClaimedButton>
                  )}
                </Action>
              </ChainCardTopRight>
            </ChainCardTop>
            <ChainCardBottom>
              <ChainCardInfo>
                <ChainCardInfoTitle>Currency</ChainCardInfoTitle>
                <ChainCardInfoValue>FTM</ChainCardInfoValue>
              </ChainCardInfo>
              <ChainCardInfo>
                <ChainCardInfoTitle>Chain ID</ChainCardInfoTitle>
                <ChainCardInfoValue>137</ChainCardInfoValue>
              </ChainCardInfo>
              <ChainCardInfo>
                <ChainCardInfoTitle>This Round Claims</ChainCardInfoTitle>
                <ChainCardInfoValue>2,134</ChainCardInfoValue>
              </ChainCardInfo>
              <ChainCardInfo>
                <ChainCardInfoTitle>Total Claims</ChainCardInfoTitle>
                <ChainCardInfoValue>2.134</ChainCardInfoValue>
              </ChainCardInfo>
            </ChainCardBottom>
          </ChainCard>
        </div>
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
