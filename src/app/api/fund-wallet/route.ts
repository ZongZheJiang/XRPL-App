// app/api/fund-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const fundSchema = z.object({
  address: z.string().startsWith('r'),
});

const FAUCET_URL = "https://faucet.altnet.rippletest.net/accounts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = fundSchema.parse(body);
    
    const faucetResponse = await fetch(FAUCET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: address }),
    });

    if (!faucetResponse.ok) {
        const errorText = await faucetResponse.text();
        return NextResponse.json({ error: `Faucet returned status ${faucetResponse.status}: ${errorText}`}, { status: 500 });
    }

    const data = await faucetResponse.json();
    return NextResponse.json({ success: true, message: `Test XRP sent to ${address}`, data });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}