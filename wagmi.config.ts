import { defineConfig } from "@wagmi/cli"
import { etherscan, react } from "@wagmi/cli/plugins"
import { erc20ABI } from "wagmi"
import { mainnet } from "wagmi/chains"
import UnitapPass from "@/abis/UnitapPass.json"
import UnitapPassMain from "@/abis/UnitapPassMain.json"
import UnitapEVMTokenTap from "@/abis/UnitapEVMTokenTap.json"
import AutoFund from "@/abis/AutoFund.json"
import UnitapPassBatchSaleMain from "@/abis/UnitapPassBatchSaleMain.json"
import PrizeTap from "@/abis/UnitapPrizeTap.json"
import PrizeTap721 from "@/abis/UnitapPrizeTap721.json"

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
    },
    {
      name: "UnitapPassBatchSale",
      abi: UnitapPassBatchSaleMain as any,
      address: "0x4649b7d433ee4ba472fd76073b07f082d8b18e9b",
    },
    {
      name: "PrizeTap",
      abi: PrizeTap,
    },
    {
      name: "PrizeTap721",
      abi: PrizeTap721,
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
})
