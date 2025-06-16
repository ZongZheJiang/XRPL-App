import React, { useState } from "react";
// import { createWallet } from "../api";

interface WalletCreatorProps {
  onWalletCreated: () => Promise<void>;
}

const WalletCreator: React.FC<WalletCreatorProps> = ({ onWalletCreated }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    setWallet(null);

    // Timeout promise helper
    function timeoutPromise(ms, promise) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Request timed out"));
        }, ms);
        promise
          .then((res) => {
            clearTimeout(timer);
            resolve(res);
          })
          .catch((err) => {
            clearTimeout(timer);
            reject(err);
          });
      });
    }

    try {
      const newWallet = await timeoutPromise(150000, createWallet());
      setWallet(newWallet);
    } catch (err) {
      setError(err.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating Wallet..." : "Create Wallet"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
      )}

      {wallet && (
        <div style={{ marginTop: "10px" }}>
          <div>
            <strong>Address:</strong> {wallet.address}
          </div>
          <div>
            <strong>Secret:</strong> {wallet.secret}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCreator;
