"use client";


import Icon from "@/components/ui/Icon";
import { Chain } from "@/types";
import { getChainIcon } from "@/utils/chain";
import { useWalletProvider } from "@/utils/wallet";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";

interface ChainItemProps {
  chain: Chain;
  selected?: boolean;
  onClick: () => void;
  "data-testid"?: string;
}

const ChainItem = (props: ChainItemProps) => {
  const { selected, chain, onClick } = props;
  const icon = getChainIcon(chain);
  const provider = useWalletProvider();


  const { data } = useBalance({
    address: chain.fundManagerAddress,
    chainId: Number(chain.chainId)
  })



  return (
    <div
      className="bg-gray30 rounded-xl border-2 transition-all duration-50 border-gray50 hover:bg-gray40 hover:border-gray80 flex px-4 py-3.5 pl-3 items-center mb-3 cursor-pointer last:mb-0"
      onClick={onClick}
      data-testid={props["data-testid"]}
    >
      <Icon mr={2} width="32px" iconSrc={icon}></Icon>
      <p className="token-symbol text-white font-semibold mr-auto">
        {chain.chainName}
      </p>
      <p className="balance mr-2 text-gray90 text-xs">Contract Balance: </p>
      <p className="balance-amount text-white text-xs">
        {data
          ? formatUnits(data.value, data.decimals).slice(0, 7)
          : "..."}
      </p>
      {selected && (
        <Icon
          className="ml-2"
          iconSrc="/assets/images/modal/check.svg"
          width="13px"
          height="auto"
        />
      )}
    </div>
  );
};

export default ChainItem;
