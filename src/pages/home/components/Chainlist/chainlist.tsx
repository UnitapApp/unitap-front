import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { ClaimButton, ClaimedButton, NoCurrencyButton, SecondaryButton } from 'components/basic/Button/button';
import { ClaimContext } from 'hooks/useChainList';
import { formatWeiBalance } from 'utils/numbers';
import { getChainIcon } from '../../../../utils';
import Icon from 'components/basic/Icon/Icon';
import useSelectChain from '../../../../hooks/useSelectChain';
import { useWeb3React } from '@web3-react/core';
import { Chain, ClaimReceipt } from 'types';
import { BigNumber } from 'ethers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useNativeCurrencyOnChain } from 'hooks/useNativeCurrency';
import JSBI from 'jsbi';
import { CurrencyAmount } from '@uniswap/sdk-core';

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

const ChainList = () => {
  const { chainList, chainListSearchResult } = useContext(ClaimContext);

  const windowSize = window.innerWidth;

  return (
    <div className="chain-list-wrapper py-2 w-full mb-20">
      <div>
        {!chainList.length && (
          <div style={{ color: 'white', textAlign: 'center' }} data-testid="chain-list-loading">
            Loading...
          </div>
        )}
        {chainListSearchResult.map((chain) => (
          <ChainCard chain={chain} key={chain.pk} />
        ))}
        {chainListSearchResult.length === 0 && chainList.length && (
          <Icon
            iconSrc={
              windowSize > 992 ? 'assets/images/claim/empty-list.svg' : 'assets/images/claim/empty-list-mobile.svg'
            }
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

type ChainCardProps = {
  chain: Chain;
};

const ChainCard = ({ chain }: ChainCardProps) => {
  const { openClaimModal } = useContext(ClaimContext);

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const addAndSwitchToChain = useSelectChain();
  const { account } = useWeb3React();
  const active = !!account;

  const { provider } = useWeb3React();
  const [fundManagerBalance, setFundManagerBalance] = useState<BigNumber | null>(null);

  useEffect(() => {
    new StaticJsonRpcProvider(chain.rpcUrl)?.getBalance(chain.fundManagerAddress).then((balance) => {
      setFundManagerBalance(balance);
    });
  }, [chain, provider]);

  const nativeCurrency = useNativeCurrencyOnChain(Number(chain.chainId));

  const fundManagerBalanceAmount = useMemo(() => {
    if (!fundManagerBalance) return null;
    const amount = JSBI.BigInt(fundManagerBalance.toString());
    return CurrencyAmount.fromRawAmount(nativeCurrency, amount);
  }, [nativeCurrency, fundManagerBalance]);

  const { activeClaimHistory } = useContext(ClaimContext);

  return (
    <div key={chain.chainId}>
      <div className="chain-card flex flex-col items-center justify-center w-full mb-4">
        <div
          className={
            'pt-4 pr-6 pb-4 pl-3 bg-gray40 w-full flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center rounded-t-xl '
          }
        >
          <div className="hover:cursor-pointer items-center flex mb-6 sm:mb-0">
            <span className="chain-logo-container w-10 h-10 flex justify-center">
              <img className="chain-logo w-auto h-[100%]" src={getChainIcon(chain)} alt="polygon logo" />
            </span>
            <p className=" text-white ml-3 text-center sm:text-left" data-testid={`chain-name-${chain.pk}`}>
              {chain.chainName}
            </p>
            {/* <img className="arrow-icon mt-1 ml-1 w-2" src="assets/images/arrow-icon.svg" alt="arrow" /> */}
          </div>

          <div className={'flex items-center justify-end flex-col sm:flex-row gap-2 sm:gap-0 sm:w-auto'}>
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

            <div className="action flex flex-col md:flex-row w-full sm:w-auto items-center sm:items-end">
              {/* todo migrate buttom logic*/}
              {chain.needsFunding ? (
                <NoCurrencyButton disabled fontSize="13px">
                  Empty
                </NoCurrencyButton>
              ) : !activeClaimHistory.find((claim: ClaimReceipt) => claim.chain === chain.pk) ? (
                <ClaimButton
                  data-testid={`chain-show-claim-${chain.pk}`}
                  mlAuto
                  onClick={() => openClaimModal(chain)}
                  className="text-sm m-auto"
                >
                  <p>{`Claim ${formatWeiBalance(chain.maxClaimAmount)} ${chain.symbol}`}</p>
                </ClaimButton>
              ) : 
                activeClaimHistory.find((claim: ClaimReceipt) => claim.chain === chain.pk)?.status === '1' ? (
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
              ) : (
                <ClaimButton
                  data-testid={`chain-show-claim-${chain.pk}`}
                  mlAuto
                  onClick={() => openClaimModal(chain)}
                  className="text-sm m-auto"
                >
                  <p>Pending ...</p>
                </ClaimButton>
              )}
            </div>
          </div>
        </div>
        <div
          className={
            'bg-gray30 w-full gap-2 md:gap-0 items-center flex flex-col md:flex-row rounded-b-xl p-4 justify-between'
          }
        >
          <div className={'bg-gray30 w-full items-center flex rounded-b-xl px-4 justify-between md:justify-start'}>
            <p className="chain-card__info__title text-sm text-gray90">Balance:</p>
            <p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
              {fundManagerBalanceAmount ? fundManagerBalanceAmount.toSignificant(5) : '0.00'} {chain.symbol}
            </p>
            {/* <LightOutlinedButton className='donate-gas !p-1 !px-2 !text-xs !font-medium ml-4'>Provide gas</LightOutlinedButton> */}
          </div>
          <div className={'bg-gray30 w-full items-center flex rounded-b-xl px-4 justify-between md:justify-center'}>
            <p className="chain-card__info__title text-sm text-gray90">This Round Claims:</p>
            <p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
              {numberWithCommas(chain.totalClaimsSinceLastMonday)}
            </p>
          </div>
          <div className={'bg-gray30 w-full items-center flex rounded-b-xl px-4 justify-between md:justify-end'}>
            <p className="chain-card__info__title text-sm text-gray90">Total Claims:</p>
            <p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
              {numberWithCommas(chain.totalClaims)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainList;
