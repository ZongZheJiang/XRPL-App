import { NextResponse } from 'next/server';
import { Client, Wallet, xrpToDrops, isoTimeToRippleTime } from 'xrpl';
import * as crypto from 'crypto';
import supabase from '@/lib/supabaseClient'; // Your Supabase client

// --- In a real app, these would come from a secure vault/KMS ---
const BUYER_WALLET_SEED = process.env.BUYER_WALLET_SEED!; 
const XRPL_NODE = 'wss://s.altnet.rippletest.net:51233'; // Testnet

export async function POST(request: Request) {
  const { sellerAddress, amountXrp } = await request.json();

  if (!sellerAddress || !amountXrp) {
    return NextResponse.json({ message: 'Missing sellerAddress or amountXrp' }, { status: 400 });
  }

  const xrplClient = new Client(XRPL_NODE);
  await xrplClient.connect();

  try {
    const buyerWallet = Wallet.fromSeed(BUYER_WALLET_SEED);

    // 1. Generate the Crypto Condition (The Lock & Key)
    const preimage = crypto.randomBytes(32); // The secret key
    const condition = crypto.createHash('sha256').update(preimage).digest(); // The public lock

    // 2. Define the Escrow Expiration
    const cancelDate = new Date();
    cancelDate.setDate(cancelDate.getDate() + 7); // Escrow can be cancelled after 7 days
    const rippleCancelTime = isoTimeToRippleTime(cancelDate.toISOString());

    // 3. Prepare the EscrowCreate Transaction
    const escrowTx = {
      TransactionType: 'EscrowCreate',
      Account: buyerWallet.classicAddress,
      Amount: xrpToDrops(amountXrp), // Amount must be in "drops"
      Destination: sellerAddress,
      CancelAfter: rippleCancelTime,
      Condition: condition.toString('hex').toUpperCase(), // The public lock
      DestinationTag: 1, // Optional: for exchanges
    };

    const preparedTx = await xrplClient.autofill(escrowTx);
    const signedTx = buyerWallet.sign(preparedTx);
    const txResult = await xrplClient.submitAndWait(signedTx.tx_blob);

    if (txResult.result.meta?.TransactionResult !== 'tesSUCCESS') {
        throw new Error(`Escrow creation failed: ${txResult.result.meta?.TransactionResult}`);
    }

    // 4. Save the Escrow State to Supabase
    const { data, error } = await supabase.from('escrows').insert({
      buyer_address: buyerWallet.classicAddress,
      seller_address: sellerAddress,
      amount_xrp: amountXrp,
      status: 'pending',
      xrpl_condition: condition.toString('hex').toUpperCase(),
      xrpl_preimage: preimage.toString('hex').toUpperCase(), // Store the secret key
      cancel_after: cancelDate.toISOString(),
      create_tx_hash: signedTx.hash,
    }).select().single();
    
    if (error) throw error;

    await xrplClient.disconnect();
    return NextResponse.json({ success: true, escrowId: data.id, txHash: signedTx.hash });

  } catch (error: any) {
    await xrplClient.disconnect();
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}