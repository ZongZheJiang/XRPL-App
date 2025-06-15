// lib/xrpl.ts
import { Client, Wallet, xrpToDrops, dropsToXrp } from "xrpl";
import {
  TrustSet,
  TrustSetFlags,
  Payment,
  IssuedCurrencyAmount,
  AccountInfo,
  AccountLines,
} from "xrpl/dist/npm/models/transactions";

// Initialize the client once and export it
export const client = new Client(process.env.XRPL_CLIENT_URL!);

// Helper to ensure the client is connected before use
async function ensureConnected() {
  if (!client.isConnected()) {
    await client.connect();
  }
}

export const RLUSD_ISSUER_ADDRESS = process.env.RLUSD_ISSUER_ADDRESS!;
export const ISSUER_WALLET = Wallet.fromSeed(process.env.RLUSD_ISSUER_SEED!);

export async function getXrpBalance(address: string): Promise<number> {
  await ensureConnected();
  try {
    const response = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated",
    });
    return dropsToXrp(response.result.account_data.Balance);
  } catch (error) {
    // If account not found, error is thrown. Balance is 0.
    return 0;
  }
}

export async function getRlusdBalance(address: string): Promise<number> {
  await ensureConnected();
  try {
    const response = await client.request({
      command: "account_lines",
      account: address,
      peer: RLUSD_ISSUER_ADDRESS,
      ledger_index: "validated",
    });

    const usdLine = response.result.lines.find(
      (line) => line.currency === "USD",
    );
    return usdLine ? Math.abs(parseFloat(usdLine.balance)) : 0;
  } catch (error) {
    return 0;
  }
}

// ... other XRPL helpers like create_escrow, finish_escrow would go here ...
