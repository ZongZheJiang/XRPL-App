// app/api/create-wallet/route.ts
import { NextResponse } from "next/server";
import { Wallet } from "xrpl";

// This function handles POST requests to /api/create-wallet
export async function POST(request: Request) {
  try {
    const newWallet = Wallet.generate(); // The xrpl.js equivalent

    return NextResponse.json({
      address: newWallet.classicAddress,
      seed: newWallet.seed,
      publicKey: newWallet.publicKey,
      privateKey: newWallet.privateKey,
    });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
