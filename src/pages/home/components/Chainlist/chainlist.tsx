import React, { useContext } from "react";
import styled from "styled-components/";
import { DV } from "components/basic/designVariables";
import { ClaimButton, ClaimedButton, SecondaryButton } from "components/basic/Button/button";
import { ClaimContext } from "hooks/useChainList";
import { formatWeiBalance } from "utils/numbers";
import { getChainIcon } from "../../../../utils";
import Icon from "components/basic/Icon/Icon";
import useSelectChain from "../../../../hooks/useSelectChain";
import { useWeb3React } from "@web3-react/core";

// ###### Local Styled Components

const ChainCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const ChainCardTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${DV.sizes.baseRadius * 1.5}px ${DV.sizes.baseRadius * 1.5}px 0 0;
  background-color: #1e1e29;
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 1.5}px;

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

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    margin-bottom: ${DV.sizes.baseMargin * 2}px;
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
  min-height: 40px;
  border-radius: 0 0 ${DV.sizes.baseRadius * 1.5}px ${DV.sizes.baseRadius * 1.5}px;
  flex-wrap: wrap;
  padding: 0 ${DV.sizes.basePadding * 2}px;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    padding: ${DV.sizes.basePadding * 0.75}px ${DV.sizes.basePadding}px;
  }
`;

const ChainCardInfo = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    justify-content: flex-start;
    padding-left: ${DV.sizes.basePadding}px;
  }
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
  }
`;

const Action = styled.div`
  flex: 5;
  display: flex;
  align-items: flex-start;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    flex-direction: column;
    width: 100%;

    button {
      margin-right: 0 !important;
      display: block;
      width: 100%;
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
  height: 40px;

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

  const addAndSwitchToChain = useSelectChain();
  const { account } = useWeb3React();
  const active = !!account;

  const windowSize = window.innerWidth;

  return (
    <ChainListWrapper>
      <div>
        {!chainList.length && (
          <div style={{ color: "white", textAlign: "center" }} data-testid="chain-list-loading">
            Loading...
          </div>
        )}
        {chainListSearchResult.map((chain) => {
          return (
            <div key={chain.chainId}>
              <ChainCard>
                <ChainCardTop>
                  <ChainCardTopLeft>
                    <img className="chain-logo" src={getChainIcon(chain)} alt="polygon logo" />
                    <ChainName data-testid={`chain-name-${chain.pk}`}>{chain.chainName}</ChainName>
                    <img className="arrow-icon" src="assets/images/arrow-icon.svg" alt="arrow" />
                  </ChainCardTopLeft>
                  <ChainCardTopRight>
                    <AddMetamaskButton
                      mr={2}
                      disabled={!active}
                      data-testid={`chain-switch-${chain.pk}`}
                      onClick={() => addAndSwitchToChain(chain)}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                        alt="metamask logo"
                      />
                      Add
                    </AddMetamaskButton>
                    <Action>
                      {/* to-do migrate buttom logic*/}
                      {chain.unclaimed !== 0 ? (
                        // <NoCurrencyButton disabled fontSize='13px'>
                        //   Currently out of balance
                        // </NoCurrencyButton>
                        <ClaimButton
                          data-testid={`chain-show-claim-${chain.pk}`}
                          mlAuto
                          onClick={() => openClaimModal(chain)}
                        >
                          <p>{`Claim ${formatWeiBalance(chain.maxClaimAmount)} ${chain.symbol}`}</p>
                        </ClaimButton>
                      ) : (
                        <ClaimedButton
                          data-testid={`chain-claimed-${chain.pk}`}
                          mlAuto
                          icon="../assets/images/claim/claimedIcon.svg"
                          iconWidth={24}
                          iconHeight={20}
                          onClick={() => openClaimModal(chain)}
                        >
                          <p>Claimed!</p>
                        </ClaimedButton>
                      )}
                    </Action>
                  </ChainCardTopRight>
                </ChainCardTop>
                <ChainCardBottom>
                  <ChainCardInfo>
                    <ChainCardInfoTitle>Currency</ChainCardInfoTitle>
                    <ChainCardInfoValue>{chain.symbol}</ChainCardInfoValue>
                  </ChainCardInfo>
                  <ChainCardInfo>
                    <ChainCardInfoTitle>Chain ID</ChainCardInfoTitle>
                    <ChainCardInfoValue>{chain.chainId}</ChainCardInfoValue>
                  </ChainCardInfo>
                  <ChainCardInfo>
                    <ChainCardInfoTitle>This Round Claims</ChainCardInfoTitle>
                    <ChainCardInfoValue>{chain.totalClaimsSinceLastMonday}</ChainCardInfoValue>
                  </ChainCardInfo>
                  <ChainCardInfo>
                    <ChainCardInfoTitle>Total Claims</ChainCardInfoTitle>
                    <ChainCardInfoValue>{chain.totalClaims}</ChainCardInfoValue>
                  </ChainCardInfo>
                </ChainCardBottom>
              </ChainCard>
            </div>
          );
        })}
        {chainListSearchResult.length === 0 && chainList.length && (
          <Icon
            iconSrc={
              windowSize > 992 ? "assets/images/claim/empty-list.svg" : "assets/images/claim/empty-list-mobile.svg"
            }
            width="100%"
          />
        )}
      </div>
    </ChainListWrapper>
  );
};

export default ChainList;
