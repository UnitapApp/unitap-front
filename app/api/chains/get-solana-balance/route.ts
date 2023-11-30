import { NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

const SOLANA_CONNECTION = new Connection(process.env.SOLANA_HTTP_PROVIDER!)

const WALLET_ADDRESS = process.env.SOLANA_WALLET_ADDRESS!

export const revalidate = true
export const maxDuration = 10

export async function GET() {
  try {
    const balance = await SOLANA_CONNECTION.getBalance(
      new PublicKey(WALLET_ADDRESS)
    )

    return NextResponse.json(
      { balance: balance / LAMPORTS_PER_SOL },
      { status: 200 }
    )
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      {
        balance: null,
      },
      { status: 200 }
    )
  }
}
