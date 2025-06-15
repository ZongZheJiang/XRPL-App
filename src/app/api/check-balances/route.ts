// app/api/check-balances/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getXrpBalance, getRlusdBalance } from '@/lib/xrpl';

// Use Zod to define the expected request body shape
const balanceSchema = z.object({
  wallet_address: z.string().startsWith('r'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet_address } = balanceSchema.parse(body);

    const [xrpBalance, rlusdBalance] = await Promise.all([
        getXrpBalance(wallet_address),
        getRlusdBalance(wallet_address),
    ]);
    
    return NextResponse.json({
      wallet_address,
      xrp_balance: xrpBalance,
      rlusd_balance: rlusdBalance,
      success: true,
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}