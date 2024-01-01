import { NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { getChainList } from "@/utils/api";
import { ChainType } from "@/types";

const SOLANA_CONNECTION = new Connection(clusterApiUrl("testnet"));

const WALLET_ADDRESS = process.env.SOLANA_TESTNET_WALLET_ADDRESS!;

const SOLANA_TESTNET_CHAIN_ID = "1399811150";

export const revalidate = true;
export const maxDuration = 10;

export async function GET() {
  const chains = await getChainList();

  const solanaChain = chains.find(
    (chain) =>
      chain.chainType === ChainType.SOLANA &&
      chain.isTestnet &&
      chain.chainId === SOLANA_TESTNET_CHAIN_ID
  );

  if (!solanaChain)
    return NextResponse.json(
      {
        balance: null,
      },
      { status: 200 }
    );

  try {
    const balance = await SOLANA_CONNECTION.getBalance(
      new PublicKey(solanaChain?.fundManagerAddress)
    );

    return NextResponse.json(
      { balance: balance / LAMPORTS_PER_SOL },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        balance: null,
      },
      { status: 200 }
    );
  }
}
