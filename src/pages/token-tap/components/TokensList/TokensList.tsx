import React, { useContext } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { ClaimButton, ClaimedButton, NoCurrencyButton, SecondaryButton } from 'components/basic/Button/button';
import { ClaimContext } from 'hooks/useChainList';
import { formatWeiBalance } from 'utils/numbers';
import Icon from 'components/basic/Icon/Icon';
import { useWeb3React } from '@web3-react/core';
import useSelectChain from 'hooks/useSelectChain';
import { getChainIcon } from 'utils';

const ChainCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const ChainCardTopLeft = styled.div`
  display: flex;
  align-items: center;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    margin-bottom: ${DV.sizes.baseMargin * 2}px;
  }
`;

const ChainCardTopRight = styled.div`
  display: flex;
  align-items: center;
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

const Action = styled.div`
  //flex: 5;
  display: flex;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    flex-direction: column;
    //width: 100%;
    button {
      //margin-right: 0 !important;
      //display: block;
      //width: 100%;
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
  font-weight: 500;

  img {
    width: 20px;
    height: 20px;
    transform: scale(1.4);
  }
`;

const TokensList = () => {
  const { chainList, chainListSearchResult, openClaimModal } = useContext(ClaimContext);

  const addAndSwitchToChain = useSelectChain();
  const { account } = useWeb3React();
  const active = !!account;

  const windowSize = window.innerWidth;

  return (
    <div className="tokens-list-wrapper py-6 mb-20 w-full">
      {!chainList.length && (
        <div style={{ color: 'white', textAlign: 'center' }} data-testid="chain-list-loading">
          Loading...
        </div>
      )}
      {chainListSearchResult.map((chain) => {
        return (
          <div key={chain.chainId}>
            <ChainCard>
              <span className="flex flex-col">
                <div className="pt-4 pr-6 pb-4 pl-3 bg-gray40 w-full flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center rounded-t-xl">
                  <div className="hover:cursor-pointer items-center flex mb-6 sm:mb-0">
                    <span className="chain-logo-container w-11 h-11 flex justify-center mr-3">
                      <img className="chain-logo w-auto h-[100%]" src={getChainIcon(chain)} alt="polygon logo" />
                    </span>
                    <span className="w-max">
                      <p
                        className="text-white text-center md:text-left flex mb-2"
                        data-testid={`chain-name-${chain.pk}`}
                      >
                        {chain.chainName}
                        <img className="arrow-icon mt-1 ml-1 w-2" src="assets/images/arrow-icon.svg" alt="arrow" />
                      </p>
                      <p className="text-xs text-white font-medium">Decentralized verification system</p>
                    </span>
                  </div>

                  <div
                    className={'flex items-center justify-end flex-col sm:flex-row gap-2 sm:gap-0 !w-full sm:w-auto'}
                  >
                    <div className="w-full sm:w-auto items-center sm:items-end">
                      <AddMetamaskButton
                        disabled={!active}
                        data-testid={`chain-switch-${chain.pk}`}
                        onClick={() => addAndSwitchToChain(chain)}
                        className="font-medium hover:cursor-pointer mx-auto sm:mr-4 text-sm !w-[220px] sm:!w-auto"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                          alt="metamask logo"
                        />
                        Add
                      </AddMetamaskButton>
                    </div>

                    <Action className={'w-full sm:w-auto items-center sm:items-end '}>
                      {/* todo migrate buttom logic*/}
                      {chain.needsFunding ? (
                        <NoCurrencyButton disabled fontSize="13px">
                          Currently out of balance
                        </NoCurrencyButton>
                      ) : chain.unclaimed !== 0 ? (
                        <ClaimButton
                          data-testid={`chain-show-claim-${chain.pk}`}
                          mlAuto
                          onClick={() => openClaimModal(chain)}
                          className="text-sm m-auto"
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
                          className="text-sm bg-dark-space-green border-2 border-space-green m-auto"
                        >
                          <p className="text-space-green flex-[2] font-medium text-sm">Claimed!</p>
                        </ClaimedButton>
                      )}
                    </Action>
                  </div>
                </div>
                <p className="text-xs text-gray100 pl-[68px] pt-4 pr-6 text-justify pb-10 bg-gray40">
                  Anyone is welcome to play to help verify those they already know. The first 2000 users who are
                  verified in Aura can claim 2 xDai. You do not need to play to become verified by Aura; You just need
                  to know one person who is playing Aura. To meet other Aura players and discuss strategy, join the Aura
                  discord.
                </p>
              </span>

              <div
                className={
                  'bg-gray30 w-full gap-2 md:gap-0 items-center flex flex-col md:flex-row rounded-b-xl p-4 justify-between'
                }
              >
                <div
                  className={'bg-gray30 w-full items-center flex rounded-b-xl px-4 justify-between md:justify-start'}
                >
                  <p className="chain-card__info__title text-sm text-gray-90">Currency</p>
                  <p className="chain-card__info__value font-mono text-sm text-white ml-3">{chain.symbol}</p>
                </div>
                <div
                  className={'bg-gray30 w-full items-center flex rounded-b-xl px-4 justify-between md:justify-start'}
                >
                  <p className="chain-card__info__title text-sm text-gray-90">Chain ID</p>
                  <p className="chain-card__info__value font-mono text-sm text-white ml-3">{chain.chainId}</p>
                </div>
                <div
                  className={'bg-gray30 w-full items-center flex rounded-b-xl px-4 justify-between md:justify-center'}
                >
                  <p className="chain-card__info__title text-sm text-gray-90">This Round Claims</p>
                  <p className="chain-card__info__value font-mono text-sm text-white ml-3">
                    {chain.totalClaimsSinceLastMonday}
                  </p>
                </div>
                <div
                  className={
                    'bg-gray30 w-full items-center flex rounded-b-xl px-4 justify-between md:justify-center md:justify-end'
                  }
                >
                  <p className="chain-card__info__title text-sm text-gray-90">Total Claims</p>
                  <p className="chain-card__info__value font-mono text-sm text-white ml-3">{chain.totalClaims}</p>
                </div>
              </div>
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
  );
};

export default TokensList;
