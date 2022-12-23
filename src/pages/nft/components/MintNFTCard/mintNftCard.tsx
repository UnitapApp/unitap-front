import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ClaimButton } from 'components/basic/Button/button';

import Icon from 'components/basic/Icon/Icon';
import { useUnitapPassMultiMintCallback } from '../../../../hooks/pass/useUnitapPassMultiMintCallback';
import { useUnitapBatchSale } from '../../../../hooks/pass/useUnitapBatchSale';
import JSBI from 'jsbi';
import { CurrencyAmount } from '@uniswap/sdk-core';
import useNativeCurrency from '../../../../hooks/useNativeCurrency';
import useSelectChain from 'hooks/useSelectChain';
import { useWeb3React } from '@web3-react/core';
import { SupportedChainId } from '../../../../constants/chains';
import { ClaimContext } from 'hooks/useChainList';

const MintNFTCard = () => {
  const [count, setCount] = useState(1);
  const claimedCount = 13;
  const maxCount = 15;
  const { price } = useUnitapBatchSale();

  const { chainId } = useWeb3React();

  const addAndSwitchToChain = useSelectChain();

  const isRightChain = useMemo(() => {
    if (!chainId) return false;
    return chainId === SupportedChainId.GOERLI;
  }, [chainId]);

  const nativeCurrency = useNativeCurrency();

  const priceAmount = useMemo(() => {
    if (!price) return null;
    const amount = JSBI.BigInt(price.toString());
    return CurrencyAmount.fromRawAmount(nativeCurrency, amount);
  }, [nativeCurrency, price]);

  const totalPriceAmount = useMemo(() => {
    if (!priceAmount) return null;
    return priceAmount.multiply(count);
  }, [count, priceAmount]);

  const { callback: mintPassCallback } = useUnitapPassMultiMintCallback(count);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submittedTxHash, setSubmittedTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  const { chainList } = useContext(ClaimContext);

  const switchNetwork = () => {
    const goerliChain = chainList.find((chain) => chain.chainId === SupportedChainId.GOERLI.toString())
    if (!goerliChain) return;
    addAndSwitchToChain(goerliChain);
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const mintPass = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const tx = await mintPassCallback?.();
      if (tx) {
        setSubmittedTxHash(tx.hash);
      }
    } catch (e) {
      console.log('mint failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  }, [loading, mintPassCallback]);

  return (
    <div className="mint-nft-card h-full flex flex-col justify-between ">
      <div className="mint-nft-card__nft p-4 h-full flex flex-col justify-between">
        <div className="mint-nft-card__nft__info text-xs font-medium flex w-full justify-between mb-7">
          <p className="text-gray100">
            <span className="text-white"> {claimedCount} </span> of
            <span className="text-white"> {maxCount} </span>
            Left in current batch
          </p>
          <p className="text-gray100">
            Network:
            <span className="text-white"> ETH</span>
          </p>
        </div>
        <div className="mint-nft-card__nft__image w-full my-14 flex justify-center">
          <div className="mint-nft-card__nft__image__wrapper gradient-outline-card w-40 h-56">
            <div className="w-full h-full overflow-hidden rounded-xl">
              <img src="https://picsum.photos/200/300" alt="nft" className="rounded-xl" />
            </div>
          </div>
        </div>
        <div className="mint-nft-card__nft__price text-sm font-semibold flex w-full justify-between mt-auto">
          <p className="text-white">{count > 1 && 'Total'} Price:</p>
          <p className="text-gray100 flex gap-x-1.5">
            {count > 1 && (
              <p>
                {count} x {priceAmount?.toSignificant(5) || '0'} ETH ={' '}
              </p>
            )}
            <span className="text-white">{totalPriceAmount?.toSignificant(5) || '0'} ETH</span>
          </p>
        </div>
      </div>
      <div className="mint-nft-card__actions bg-gray30 w-full flex-col lg:flex-row flex gap-2 justify-between items-center py-3 px-4">
        <div className="mint-nft-card__actions__quantity w-full lg:w-auto flex items-center">
          <div
            className={`text-white border-2 border-gray60 flex-1 h-12 min-w-[48px] flex justify-center py-3 items-center rounded-l-xl ${
              count === 1 ? 'cursor-default' : 'cursor-pointer hover:bg-primaryGradient'
            }`}
            onClick={() => (count !== 1 ? setCount(count - 1) : null)}
          >
            {count === 1 ? (
              <Icon iconSrc="assets/images/nft/nft-minus-gray.svg" />
            ) : (
              <Icon iconSrc="assets/images/nft/nft-minus-white.svg" />
            )}
          </div>
          <div
            className={`text-white border-y-2 border-gray60  py-3 flex-1 h-12 min-w-[48px] flex items-center justify-center font-bold cursor-default`}
          >
            {count}
          </div>
          <div
            className={`text-white border-2 border-gray60 flex-1 h-12 min-w-[48px] flex justify-center py-3 items-center rounded-r-xl ${
              count === maxCount - claimedCount ? 'cursor-default' : 'cursor-pointer hover:bg-primaryGradient'
            }`}
            onClick={() => (count !== maxCount - claimedCount ? setCount(count + 1) : null)}
          >
            {count === maxCount - claimedCount ? (
              <Icon iconSrc="assets/images/nft/nft-plus-gray.svg" />
            ) : (
              <Icon iconSrc="assets/images/nft/nft-plus-white.svg" />
            )}
          </div>
        </div>
        {isRightChain ? (
          <ClaimButton onClick={mintPass} height="48px" width="100% !important">
            <p>Mint Unitap Pass</p>
          </ClaimButton>
        ) : (
          <ClaimButton onClick={switchNetwork} height="48px" width="100% !important">
            <p>Switch Network </p>
          </ClaimButton>
        )}
      </div>
    </div>
  );
};

export default MintNFTCard;
