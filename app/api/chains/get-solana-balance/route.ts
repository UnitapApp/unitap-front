import { NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ChainType } from "@/types";
import { getChainList } from "@/utils/api";

const SOLANA_CONNECTION = new Connection(process.env.SOLANA_HTTP_PROVIDER!);

export const revalidate = 10;
export const maxDuration = 10;

export async function GET() {
  try {
    const chains = await getChainList();

    const solana = chains.find(
      (chain) => !chain.isTestnet && chain.chainType === ChainType.SOLANA
    );

    if (!solana)
      return NextResponse.json(
        {
          balance: 0,
        },
        { status: 200 }
      );

    const balance = await SOLANA_CONNECTION.getBalance(
      new PublicKey(solana.fundManagerAddress)
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
