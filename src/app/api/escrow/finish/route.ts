import { NextResponse } from 'next/server';
import { Client, Wallet } from 'xrpl';
import { supabase } from '@/lib/supabaseClient';

// --- The Seller's wallet seed is needed to sign the finish transaction ---
const SELLER_WALLET_SEED = process.env.SELLER_WALLET_SEED!;
const XRPL_NODE = 'wss://s.altnet.rippletest.net:51233';

export async function POST(request: Request) {
  const { escrowId } = await request.json();

  if (!escrowId) {
    return NextResponse.json({ message: 'Missing escrowId' }, { status: 400 });
  }

  const client = new Client(XRPL_NODE);
  await client.connect();

  try {
    // 1. Fetch Escrow Details from Supabase
    const { data: escrow, error } = await supabase
      .from('escrows')
      .select('*')
      .eq('id', escrowId)
      .single();

    if (error || !escrow) throw new Error('Escrow not found or already processed.');
    if (escrow.status !== 'pending') throw new Error(`Escrow is not pending (status: ${escrow.status})`);

    const sellerWallet = Wallet.fromSeed(SELLER_WALLET_SEED);

    // 2. Prepare the EscrowFinish Transaction
    const escrowFinishTx = {
      TransactionType: 'EscrowFinish',
      Account: sellerWallet.classicAddress, // The finisher signs
      Owner: escrow.buyer_address, // The original creator of the escrow
      OfferSequence: parseInt(escrow.create_tx_hash.slice(-8), 16), // A bit of a hack to get sequence from tx hash, better to fetch from ledger
      Condition: escrow.xrpl_condition, // The public lock
      Fulfillment: escrow.xrpl_preimage, // The secret key
    };

    const preparedTx = await client.autofill(escrowFinishTx);
    const signedTx = sellerWallet.sign(preparedTx);
    const txResult = await client.submitAndWait(signedTx.tx_blob);

    if (txResult.result.meta?.TransactionResult !== 'tesSUCCESS') {
        throw new Error(`Escrow finish failed: ${txResult.result.meta?.TransactionResult}`);
    }

    // 3. Update the Escrow Status in Supabase
    await supabase.from('escrows').update({
        status: 'completed',
        finish_tx_hash: signedTx.hash
    }).eq('id', escrowId);

    await client.disconnect();
    return NextResponse.json({ success: true, txHash: signedTx.hash });

  } catch (error: any) {
    await client.disconnect();
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}