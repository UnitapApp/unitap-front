import { ClaimButton } from 'components/basic/Button/button';
import Icon from 'components/basic/Icon/Icon';
import React, { useState } from 'react';

const MintNFTCard = () => {
  const [count, setCount] = useState(1);
  const [claimedCount, setClaimedCount] = useState(13);
  const [maxCount, setMaxCount] = useState(15);

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
        <div className="mint-nft-card__nft__image w-full mb-28 flex justify-center">
          <div className="mint-nft-card__nft__image__wrapper gradient-outline-card w-40 h-56">
            <div className="w-full h-full overflow-hidden rounded-xl">
              <img src="https://picsum.photos/200/300" alt="nft" className="rounded-xl" />
            </div>
          </div>
        </div>
        <div className="mint-nft-card__nft__price text-sm font-semibold flex w-full justify-between mt-auto">
          <p className="text-white">{count > 1 && 'Total'} Price:</p>
          <p className="text-gray100 flex gap-x-1.5">
            {count > 1 && <p>{count} x 0.10 ETH = </p>}
            <span className="text-white"> {count * 0.1} ETH</span>
          </p>
        </div>
      </div>
      <div className="mint-nft-card__actions bg-gray30 w-full flex gap-x-2 justify-between items-center py-3 px-4">
        <div className="mint-nft-card__actions__quantity flex items-center">
          <div
            className={`text-white border-2 border-gray60 w-12 h-12 flex justify-center py-3 items-center rounded-l-xl ${
              count == 1 ? 'cursor-default' : 'cursor-pointer hover:bg-primaryGradient'
            }`}
            onClick={() => count != 1 ? setCount(count - 1) : null}
          >
            {count == 1 ? (
              <Icon iconSrc="assets/images/nft/nft-minus-gray.svg" />
            ) : (
              <Icon iconSrc="assets/images/nft/nft-minus-white.svg" />
            )}
          </div>
          <div
            className={`text-white border-y-2 border-gray60 w-14 py-3 h-12 flex items-center justify-center font-bold cursor-default`}
          >
            {count}
          </div>
          <div
            className={`text-white border-2 border-gray60 w-12 h-12 flex justify-center py-3 items-center rounded-r-xl ${
              count == maxCount - claimedCount ? 'cursor-default' : 'cursor-pointer hover:bg-primaryGradient'
            }`}
            onClick={() => count != maxCount - claimedCount ? setCount(count + 1) : null}
          >
            {count == maxCount - claimedCount ? (
              <Icon iconSrc="assets/images/nft/nft-plus-gray.svg" />
            ) : (
              <Icon iconSrc="assets/images/nft/nft-plus-white.svg" />
            )}
          </div>
        </div>
        <ClaimButton height="48px" width='100% !important'>
          <p>Mint Unitap Pass</p>
        </ClaimButton>
      </div>
    </div>
  );
};

export default MintNFTCard;
