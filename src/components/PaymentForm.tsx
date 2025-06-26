"use client"; // This is a client component

import React, { useState } from "react";
import { Client, Wallet, Transaction, Payment, TransactionMetadata } from "xrpl";

// This is the public XRPL node the CLIENT will use to submit the signed transaction.
const CLIENT_SUBMIT_URL = "wss://s.altnet.rippletest.net:51233";

function PaymentForm() {
  const [senderSeed, setSenderSeed] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"XRP" | "RLUSD">("XRP");

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionResult, setTransactionResult] = useState<any | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderSeed || !receiverAddress || !amount) {
      setStatusMessage("Please fill in all fields.");
      return;
    }
    
    // Reset state for a new transaction
    setIsLoading(true);
    setStatusMessage("Starting payment process...");
    setTransactionResult(null);

    try {
      // --- Step 1: Validate seed and get public address (CLIENT-SIDE) ---
      // This happens safely in the user's browser.
      setStatusMessage("Validating your wallet seed...");
      let senderWallet: Wallet;
      try {
        senderWallet = Wallet.fromSeed(senderSeed);
      } catch (error) {
        throw new Error("Invalid secret seed. Please check it and try again.");
      }
      const senderAddress = senderWallet.classicAddress;

      // --- Step 2: Ask our server to prepare the transaction ---
      setStatusMessage("Asking server to prepare the transaction...");
      const response = await fetch('/api/prepare-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderAddress,
          receiverAddress,
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to prepare transaction.");
      }

      const preparedTx: Transaction = await response.json();
      setStatusMessage("Transaction prepared. Signing locally...");
      
      // --- Step 3: Sign the transaction LOCALLY in the browser ---
      // The secret seed NEVER leaves the browser.
      const signedTx = senderWallet.sign(preparedTx);
      setStatusMessage("Transaction signed. Submitting to the ledger...");
      
      // --- Step 4: Submit the signed transaction directly to the ledger ---
      const client = new Client(CLIENT_SUBMIT_URL);
      await client.connect();
      
      const result = await client.submitAndWait(signedTx.tx_blob);

      await client.disconnect();
      
    // 1. First, check if 'meta' exists at all and is not a string.
    if (result.result.meta && typeof result.result.meta !== 'string') {
        
        // At this point, TypeScript knows result.result.meta is an object.
        // Let's create a shorthand variable for it.
        const meta = result.result.meta;
        
        // 2. Now we can safely access TransactionResult.
        if (meta.TransactionResult === "tesSUCCESS") {
            setStatusMessage(`Payment successful! Transaction finalized on the ledger.`);
            setTransactionResult(result);
        } else {
            // We can provide a more specific error message.
            throw new Error(`Transaction failed with result: ${meta.TransactionResult}`);
        }
    } else {
        // This 'else' block now correctly handles three cases:
        // - result.result.meta is undefined
        // - result.result.meta is null
        // - result.result.meta is a string
        throw new Error("Could not determine transaction result: metadata is missing or invalid.");
    }

    } catch (error: any) {
      console.error(error);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-lg bg-base-100 shadow-xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl">Secure XRPL Payment</h2>
        <p className="text-sm opacity-70">
          Need a testnet wallet? Get one from the{" "}
          <a
            href="https://faucet.altnet.rippletest.net/accounts"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            XRPL Testnet Faucet
          </a>
        </p>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Your Secret Seed (s...)</span>
            </label>
            <input
              type="password"
              placeholder="Your secret seed (kept in browser)"
              className="input input-bordered w-full"
              value={senderSeed}
              onChange={(e) => setSenderSeed(e.target.value)}
              disabled={isLoading}
            />
             <label className="label">
                <span className="label-text-alt text-warning">This will not be sent to the server. For production, use a secure wallet like Xumm/Xaman.</span>
            </label>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Receiver's Address (r...)</span>
            </label>
            <input
              type="text"
              placeholder="Destination r... address"
              className="input input-bordered w-full"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-grow">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 100"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Currency</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "XRP" | "RLUSD")}
                disabled={isLoading}
              >
                <option>XRP</option>
                <option>RLUSD</option>
              </select>
            </div>
          </div>

          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner"></span> : "Send Securely"}
            </button>
          </div>
        </form>
        
        {statusMessage && (
            <div className="alert mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{statusMessage}</span>
            </div>
        )}

        {transactionResult && (
            <div className="alert alert-success mt-4">
                <div>
                    <span>Payment Confirmed!</span>
                    <a 
                        href={`https://testnet.xrpl.org/transactions/${transactionResult.result.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-neutral"
                    >
                        View Transaction on Explorer
                    </a>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default PaymentForm;