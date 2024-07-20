import { Address } from "viem";
import { SupportedChainId } from "./chains";
import { polygon } from "viem/chains";

export type AddressMap = { [chainId: number]: Address | undefined };

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: "0x85D395e783E1e5735B7bd66136D45Df194648EfB",
};

export const UNITAP_PASS_BATCH_SALE_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: "0xC99B2Fa525E1a0C17dB4fdE3540faA1575885A8B",
  [SupportedChainId.MAINNET]: "0x4649b7d433ee4ba472fd76073b07f082d8b18e9b",
  [SupportedChainId.GNOSIS]: undefined,
  [SupportedChainId.BASE]: "0xCcEa5FB3Da0B89d073f1ac12A35a8f24caF0d76C",
};

export const UNITAP_PASS_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: "0x904018a4e9905021C1806A054E6EbD5796570131",
  [SupportedChainId.MAINNET]: "0x23826Fd930916718a98A21FF170088FBb4C30803",
  [SupportedChainId.GNOSIS]: undefined,
  [SupportedChainId.BASE]: "0xA27b7B65b0de0c08b002E6be828731FA865027bB",
};

export const UNITAP_TOKEN_TAP_ADDRESS: AddressMap = {
  [SupportedChainId.GNOSIS]: "0xB67ec856346b22e4BDA2ab2B53d70D61a2014358",
};

export const getSupportedChainId = () =>
  // process.env.IS_STAGE ? SupportedChainId.GOERLI : SupportedChainId.MAINNET
  SupportedChainId.BASE;

export const getPassBatchSaleAddress = () =>
  // process.env.IS_STAGE
  // ? UNITAP_PASS_BATCH_SALE_ADDRESS[SupportedChainId.GOERLI]
  // :
  UNITAP_PASS_BATCH_SALE_ADDRESS[SupportedChainId.BASE];

export const tokenTapContractAddressList: { [key: string]: Address } = {
  SONG: "0x3d1b1D14333D56472f7ADf044598d1605C67609f",
  Bright: "0xB67ec856346b22e4BDA2ab2B53d70D61a2014358",
  OP: "0x54a839FF128DC1891a03d7a81724bD5D51A5902b",
  USDC: "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC",
  LINK: "0xd78Bc9369ef4617F5E3965d47838a0FCc4B9145F",
};

type ChainAddressManager = {
  [chainId: string]: {
    erc20: Address;
    erc721?: Address;
  };
};

export const contractAddresses: {
  tokenTap: ChainAddressManager;
  prizeTap: ChainAddressManager;
} = {
  tokenTap: {
    "42161": {
      // Arbitrum One
      erc20: "0x540411EF5bb81FEBB0fD3Fd30Cbfb81985f5613B",
    },
    "10": {
      // Optimism
      erc20: "0x540411EF5bb81FEBB0fD3Fd30Cbfb81985f5613B",
    },
    "59144": {
      //Linea
      erc20: "0x540411EF5bb81FEBB0fD3Fd30Cbfb81985f5613B",
    },
    "7777777": {
      // Zora
      erc20: "0x540411EF5bb81FEBB0fD3Fd30Cbfb81985f5613B",
    },
    "137": {
      //Polygon
      erc20: "0x540411EF5bb81FEBB0fD3Fd30Cbfb81985f5613B",
    },
    // "30": {
    //   erc20: "0x785996054151487B296005aAeC8CAE7C209D1385",
    // },
    // "8453": {
    //   //Base
    //   erc20: "0x540411EF5bb81FEBB0fD3Fd30Cbfb81985f5613B",
    // },

    // "204": {
    //   erc20: "0x785996054151487B296005aAeC8CAE7C209D1385",
    // },
    // "42220": {
    //   erc20: "0x785996054151487B296005aAeC8CAE7C209D1385",
    // },
  },
  prizeTap: {
    "42161": {
      // Arbitrum One
      erc20: "0xeb1Ad34EA13aF7Ec73Bb872F3Ab2B9250d62b7FD",
      erc721: "0xAaBD83213d545180eeC498877Aa7891E232FCE59",
    },
    "59144": {
      // Linea
      erc20: "0xeb1Ad34EA13aF7Ec73Bb872F3Ab2B9250d62b7FD",
      erc721: "0xAaBD83213d545180eeC498877Aa7891E232FCE59",
    },
    "10": {
      // Op mainnet
      erc20: "0xeb1Ad34EA13aF7Ec73Bb872F3Ab2B9250d62b7FD",
      erc721: "0xAaBD83213d545180eeC498877Aa7891E232FCE59",
    },
    "7777777": {
      // Zora
      erc20: "0xeb1Ad34EA13aF7Ec73Bb872F3Ab2B9250d62b7FD",
      erc721: "0xAaBD83213d545180eeC498877Aa7891E232FCE59",
    },
    "8453": {
      //Base
      erc20: "0xeb1Ad34EA13aF7Ec73Bb872F3Ab2B9250d62b7FD",
      erc721: "0xAaBD83213d545180eeC498877Aa7891E232FCE59",
    },
    "97": {
      // BSC test net
      erc20: "0x183390bE36EA575D93b5651c36cFe73DF642eD1b",
      erc721: "0x0000000000000000000000000000000000000000",
    },
    // "30": {
    //   erc20: "0xC74089ff29CC6F46DE9318F4a6b482cEadbf814C",
    //   erc721: "0xAB98C8DAD87C2fEB1fb723994c97845f26bc1dce",
    // },

    // "204": {
    //   erc20: "0xC74089ff29CC6F46DE9318F4a6b482cEadbf814C",
    //   erc721: "0xAB98C8DAD87C2fEB1fb723994c97845f26bc1dce",
    // },
    // "42220": {
    //   erc20: "0xC74089ff29CC6F46DE9318F4a6b482cEadbf814C",
    //   erc721: "0xAB98C8DAD87C2fEB1fb723994c97845f26bc1dce",
    // },
    // "137": {
    //   erc20: "0xC74089ff29CC6F46DE9318F4a6b482cEadbf814C",
    //   erc721: "0xAB98C8DAD87C2fEB1fb723994c97845f26bc1dce",
    // },
  },
};
