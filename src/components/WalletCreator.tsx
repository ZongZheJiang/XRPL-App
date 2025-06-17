import React, { useState } from "react";

interface WalletCreatorProps {
  onWalletCreated: () => Promise<void>;
}

const WalletCreator: React.FC<WalletCreatorProps> = ({ onWalletCreated }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  type Wallet = {
    address: string;
    seed: string;
    publicKey: string;
    privateKey: string;
  };

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    setWallet(null);

    try {
      const response = await fetch("/api/create-wallet", {
        method: "POST",
      });

      if (!response.ok) {
        // Handle HTTP errors like 404 or 500
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: Wallet = await response.json();
      setWallet(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
