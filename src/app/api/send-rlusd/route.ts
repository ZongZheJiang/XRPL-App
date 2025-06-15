// app/api/send-rlusd/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { client, ISSUER_WALLET, RLUSD_ISSUER_ADDRESS } from '@/lib/xrpl';
import { Payment, IssuedCurrencyAmount } from 'xrpl';

const sendSchema = z.object({
    destination: z.string().startsWith('r'),
    amount: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, amount } = sendSchema.parse(body);

    await client.connect();

    const payment: Payment = {
        TransactionType: "Payment",
        Account: ISSUER_WALLET.classicAddress,
        Destination: destination,
        Amount: {
            currency: "USD",
            issuer: RLUSD_ISSUER_ADDRESS,
            value: amount.toString(),
        }
    };

    const prepared = await client.autofill(payment);
    const signed = ISSUER_WALLET.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return NextResponse.json({
        success: true,
        tx_hash: result.result.hash,
        destination: destination,
        amount: amount,
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}