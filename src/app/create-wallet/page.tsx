"use client";

import React, { useState } from "react";
import WalletCreator from "../../components/WalletCreator";
import Link from "next/link";

function CreateWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/wallet", {
        method: "POST",
      });
      const data = await res.json();
      setWallet(data);
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="card w-96 bg-base-100 card-xl shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Create XRPL Wallet</h2>
          <p>Placeholder Subtext</p>
          <WalletCreator onWalletCreated={handleCreateWallet} />
        </div>
      </div>
    </div>
  );
}

export default CreateWallet;
