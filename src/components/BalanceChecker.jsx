"use client";

import React, { useState } from "react";
import { set } from "zod";

const BalanceChecker = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckBalance = async (address) => {
    try {
      const response = await fetch(`/api/check-balances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch balance");
      }

      const data = await response.json();
      console.log("Balance Data:", data);
      setBalances(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="card w-96 bg-base-100 card-xl shadow-lg">
        <div className="card-body">
          <h2 className="card-title">XRP & RLUSD Balance Checker</h2>
          <div className="input-group">
            <label htmlFor="walletAddress">Wallet Address:</label>
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter XRP wallet address"
            />
          </div>
          <button onClick={handleCheckBalance} disabled={loading}>
            {loading ? "Checking..." : "Check Balances"}
          </button>

          {error && <div className="error-message">{error}</div>}

          {balances && (
            <div className="balance-results">
              <h3>Balance Results</h3>
              <p>
                <strong>Wallet Address:</strong> {balances.address}
              </p>
              <p>
                <strong>XRP Balance:</strong> {balances.xrpBalance} XRP
              </p>
              <p>
                {/* CORRECT: Find the RLUSD token in the 'issuedBalances' array */}
                <strong>RLUSD Balance:</strong>{" "}
                {
                  balances.issuedBalances?.find(
                    (token) => token.currency === "RLUSD",
                  )?.value || "0.00" /* Show '0.00' if not found */
                }{" "}
                RLUSD
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceChecker;
