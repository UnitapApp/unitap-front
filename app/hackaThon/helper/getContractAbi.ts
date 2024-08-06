// import { config } from "@/utils/wallet/wagmi";
// import { getBytecode } from "@wagmi/core";
// import { ethers } from 'ethers';

// export const contractMethods = async (
//   contractAddress: string,
//   chainId: number,
// ) => {

//     const createProvider = () => {
//         const config = chainConfig[chain];
//         if (config) {
//           return new ethers.providers.JsonRpcProvider(config.rpcUrl);
//         } else {
//           throw new Error('Unsupported chain');
//         }
//       };
//   try {
//     const res = await getBytecode(config, {
//       address: contractAddress as any,
//       chainId: chainId,
//     });
//     return res != "0x";
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// };
