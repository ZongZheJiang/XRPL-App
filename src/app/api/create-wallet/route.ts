// app/api/create-wallet/route.ts
import { NextResponse } from 'next/server';
import { Wallet } from 'xrpl';
import { readWallets, writeWallets, WalletData } from '@/lib/db';

export async function POST() {
  try {
    const wallet = Wallet.generate();
    const wallets = await readWallets();

    const newWalletData: WalletData = {
      seed: wallet.seed!,
      classicAddress: wallet.classicAddress,
      publicKey: wallet.publicKey,
    };

    wallets[wallet.classicAddress] = newWalletData;
    await writeWallets(wallets);

    return NextResponse.json({
      address: wallet.classicAddress,
      secret: wallet.seed,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}