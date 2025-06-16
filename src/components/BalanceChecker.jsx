import React, { useState } from "react";
// import { checkBalances } from '../api';

const BalanceChecker = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckBalances = async () => {
    if (!walletAddress) {
      setError("Please enter a wallet address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await checkBalances(walletAddress);
      setBalances(result);
    } catch (err) {
      setError(err.message || "An error occurred while fetching balances");
    } finally {
      setLoading(false);
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

          <button onClick={handleCheckBalances} disabled={loading}>
            {loading ? "Checking..." : "Check Balances"}
          </button>

          {error && <div className="error-message">{error}</div>}

          {balances && (
            <div className="balance-results">
              <h3>Balance Results</h3>
              <p>
                <strong>Wallet Address:</strong> {balances.wallet_address}
              </p>
              <p>
                <strong>XRP Balance:</strong> {balances.xrp_balance} XRP
              </p>
              <p>
                <strong>RLUSD Balance:</strong> {balances.rlusd_balance} RLUSD
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceChecker;
