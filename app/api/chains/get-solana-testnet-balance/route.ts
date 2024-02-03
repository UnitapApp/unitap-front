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

export const revalidate = true;
export const maxDuration = 10;

export async function GET() {
  try {
    const chains = await getChainList();

    const solanaTestnet = chains.find(
      (chain) => chain.isTestnet && chain.chainType === ChainType.SOLANA
    );

    if (!solanaTestnet)
      return NextResponse.json(
        {
          balance: 0,
        },
        { status: 200 }
      );

    const balance = await SOLANA_CONNECTION.getBalance(
      new PublicKey(solanaTestnet.fundManagerAddress)
    );

    return NextResponse.json(
      { balance: balance / LAMPORTS_PER_SOL },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        balance: 0,
      },
      { status: 200 }
    );
  }
}
