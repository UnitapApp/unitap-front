import Icon from "@/components/ui/Icon";
import { ProviderDashboardFormDataProp } from "@/types";

interface Prop {
  data: ProviderDashboardFormDataProp;
}

const DisplaySelectedTokenOrNft = ({ data }: Prop) => {
  return (
    <div className="flex w-full text-white text-sm mt-4 ">
      {!data.isNft ? (
        <div className=" gap-1 w-full flex bg-gray50 rounded-xl h-[43px] overflow-hidden">
          <div className="flex gap-2 items-center bg-gray30 px-4 min-w-[123px]">
            <p>{data.selectedChain ? data.selectedChain?.chainName : ""}</p>
          </div>
          <div className="flex items-center px-5 justify-between w-full">
            <div>
              {data.isNativeToken
                ? data.selectedChain.symbol
                : data.tokenSymbol}
            </div>
            <div>{data.totalAmount}</div>
          </div>
        </div>
      ) : (
        <div className="gap-1 w-full flex bg-gray50 rounded-xl h-[71px] overflow-hidden">
          <div className="flex gap-2 items-center bg-gray30  deposit-prize-nft-cover w-[70px] h-[70px]">
            {/* <Icon iconSrc="../assets/images/prize-tap/nft-cover.svg" height="100%" width="100%" /> */}
          </div>
          <div className="flex items-center px-5 justify-between w-full">
            <div>
              <div>
                {data.nftTokenIds.length} {data.nftName}{" "}
                {data.nftTokenIds.length > 1 ? "NFTs" : "NFT"}
              </div>
              <div className="text-gray90 text-2xs">
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
