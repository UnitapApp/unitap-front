import { defineConfig } from "@wagmi/cli";
import { etherscan, react } from "@wagmi/cli/plugins";
import { mainnet } from "wagmi/chains";
import UnitapPass from "@/abis/UnitapPass.json";
import UnitapPassMain from "@/abis/UnitapPassMain.json";
import UnitapEVMTokenTap from "@/abis/UnitapEVMTokenTap.json";
import AutoFund from "@/abis/AutoFund.json";
import UnitapPassBatchSaleMain from "@/abis/UnitapPassBatchSaleMain.json";
import PrizeTap from "@/abis/UnitapPrizeTap.json";
import PrizeTap721 from "@/abis/UnitapPrizeTap721.json";
import erc20ABI from "@/abis/Erc20.json";
import TokenTap from "@/abis/TokenTap.json";

export default defineConfig({
  out: "types/abis/contracts.ts",
  contracts: [
    {
      name: "erc20",
      abi: erc20ABI,
    },
    {
      name: "UnitapPass",
      abi: UnitapPass as any,
      address: "0x4649b7d433ee4ba472fd76073b07f082d8b18e9b",
    },
    {
      name: "UnitapPassMain",
      abi: UnitapPassMain as any,
      address: "0x4649b7d433ee4ba472fd76073b07f082d8b18e9b",
    },
    {
      name: "UnitapEVMTokenTap",
      abi: UnitapEVMTokenTap as any,
    },
    {
      name: "AutoFund",
      abi: AutoFund as any,
      address: "0xE6Bc2586fcC1Da738733867BFAf381B846AAe834",
    },
    {
      name: "UnitapPassBatchSale",
      abi: UnitapPassBatchSaleMain as any,
      address: "0x4649b7d433ee4ba472fd76073b07f082d8b18e9b",
    },
    {
      name: "PrizeTap",
      abi: PrizeTap as any,
      address: "0xC74089ff29CC6F46DE9318F4a6b482cEadbf814C",
    },
    {
      name: "PrizeTap721",
      abi: PrizeTap721 as any,
      address: "0xAB98C8DAD87C2fEB1fb723994c97845f26bc1dce",
    },
    {
      name: "TokenTap",
      abi: TokenTap as any,
      address: "0x785996054151487B296005aAeC8CAE7C209D1385",
    },
  ],
  plugins: [
    etherscan({
      apiKey: process.env.ETHERSCAN_API_KEY!,
      chainId: mainnet.id,
      contracts: [],
    }),
    react(),
  ],
});
