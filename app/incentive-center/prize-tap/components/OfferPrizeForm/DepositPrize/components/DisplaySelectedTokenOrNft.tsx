import Icon from "@/components/ui/Icon";
import { ProviderDashboardFormDataProp } from "@/types";

interface Prop {
  data: ProviderDashboardFormDataProp;
}

const DisplaySelectedTokenOrNft = ({ data }: Prop) => {
  return (
    <div className="mt-4 flex w-full text-sm text-white">
      {!data.isNft ? (
        <div className="flex h-[43px] w-full gap-1 overflow-hidden rounded-xl bg-gray50">
          <div className="flex min-w-[123px] items-center gap-2 bg-gray30 px-4">
            <p>{data.selectedChain ? data.selectedChain?.chainName : ""}</p>
          </div>
          <div className="flex w-full items-center justify-between px-5">
            <div>
              {data.isNativeToken
                ? data.selectedChain.symbol
                : data.tokenSymbol}
            </div>
            <div>{data.totalAmount}</div>
          </div>
        </div>
      ) : (
        <div className="flex h-[71px] w-full gap-1 overflow-hidden rounded-xl bg-gray50">
          <div className="deposit-prize-nft-cover flex h-[70px] w-[70px] items-center gap-2 bg-gray30">
            {/* <Icon iconSrc="../quest/assets/images/prize-tap/nft-cover.svg" height="100%" width="100%" /> */}
          </div>
          <div className="flex w-full items-center justify-between px-5">
            <div>
              <div>
                {data.nftTokenIds.length} {data.nftName}{" "}
                {data.nftTokenIds.length > 1 ? "NFTs" : "NFT"}
              </div>
              <div className="text-2xs text-gray90">
                {data.nftTokenIds.join(", ")}
              </div>
            </div>
            <div>
              {" "}
              <Icon
                iconSrc={data.selectedChain && data.selectedChain?.logoUrl}
                height="24px"
                width="24px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplaySelectedTokenOrNft;
