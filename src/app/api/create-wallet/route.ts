// app/api/create-wallet/route.ts
import { NextResponse } from 'next/server';
import { Wallet } from 'xrpl';
import { supabase } from '@/lib/db';
import { create } from 'domain';

type WalletData = {
  classic_address: string;
  public_key: string;
  seed: string;
};

export async function POST() {
  try {
    const wallet = Wallet.generate();

    const newWalletData: WalletData = {
      classic_address: wallet.classicAddress,
      public_key: wallet.publicKey,
      seed: wallet.seed!,
    };

    await supabase.from('wallets').insert(newWalletData);

    return NextResponse.json({
      address: wallet.classicAddress,
      secret: wallet.seed,
    });
  } catch (error: any) {
   return NextResponse.json(
      {
        message: "Server crashed during wallet creation. See details below.",
        error_message: error.message, // e.g., "t.mask is not a function"
        error_stack: error.stack,     // The full stack trace
      },
      { status: 500 } // Keep the 500 status code
    );
  }
}