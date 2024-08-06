import axios from "axios";
import { Address } from "viem";

export const getContractAbiApi = async (contractAddress: Address) => {
  const apiKey = "7B98SETZW4TD6GC756ZC7K7TADTCTFJSE5";
  const res = await axios.get(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`,
    {
      params: {
        chainId: 42161,
      },
    },
  );

  console.log(res);
};
