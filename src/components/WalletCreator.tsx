// components/WalletCreator.jsx
"use client"; // This component uses state and event handlers

import React, { useState } from "react";

// Define the type for the wallet data we expect from the API
type WalletData = {
  address: string;
  secret: string; // The API returns 'secret', not 'seed'
};

// No props are needed now
const WalletCreator = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWallet = async () => {
    setLoading(true);
    setError(null);
    setWallet(null); // Clear previous results

    try {
      // Use a relative URL - this is a best practice
      const response = await fetch("/api/create-wallet", {
        method: "POST",
      });

      if (!response.ok) {
        // ...read the detailed JSON error object we created on the server.
        const errorData = await response.json();
        
        // Log the entire error object to the browser console.
        console.error("SERVER CRASH DETAILS:", errorData);

        // Throw an error with the specific message from the server.
        throw new Error(`Server Error: ${errorData.error_message || 'Unknown error'}`);
      }

      const data: WalletData = await response.json();
      setWallet(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // The component now renders its own card layout
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Create XRPL Wallet</h2>
        <p>Click the button to generate a new wallet address and secret.</p>

        <div className="card-actions justify-center mt-4">
          <button
            onClick={handleCreateWallet}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Creating Wallet..." : "Create New Wallet"}
          </button>
        </div>

        {/* Display Error State */}
        {error && (
          <div className="text-red-500 mt-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Display Success State */}
        {wallet && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-2">
            <h3 className="font-bold text-green-600">
              Wallet Created Successfully!
            </h3>
            <div className="break-words">
              <strong>Address:</strong> {wallet.address}
            </div>
            <div className="break-words">
              <strong>Secret:</strong> {wallet.secret}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCreator;
