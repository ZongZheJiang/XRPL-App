// lib/db.ts
import { promises as fs } from "fs";
import path from "path";

const WALLETS_FILE = path.join(process.cwd(), "src/data/wallets.json");
const ESCROWS_FILE = path.join(process.cwd(), "src/data/escrows.json");

// Define types for our data
export interface WalletData {
  seed: string;
  classicAddress: string;
  publicKey: string;
}

export interface EscrowData {
  owner: string;
  dest: string;
  // Add other escrow details as needed
}

/**
 * ⚠️ WARNING: This file-based storage is for demonstration purposes only.
 * It is NOT suitable for production, especially on serverless platforms like Vercel,
 * as the file system is ephemeral. Use a proper database (Postgres, MongoDB)
 * or a key-value store (Vercel KV, Upstash) for a real application.
 */

export async function readWallets(): Promise<Record<string, WalletData>> {
  const data = await fs.readFile(WALLETS_FILE, "utf-8");
  return JSON.parse(data);
}

export async function writeWallets(
  wallets: Record<string, WalletData>,
): Promise<void> {
  await fs.writeFile(WALLETS_FILE, JSON.stringify(wallets, null, 2));
}

export async function readEscrows(): Promise<Record<string, EscrowData>> {
  const data = await fs.readFile(ESCROWS_FILE, "utf-8");
  return JSON.parse(data);
}

export async function writeEscrows(
  escrows: Record<string, EscrowData>,
): Promise<void> {
  await fs.writeFile(ESCROWS_FILE, JSON.stringify(escrows, null, 2));
}
