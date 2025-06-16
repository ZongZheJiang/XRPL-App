"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

function Escrow() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "";

  const [destination, setDestination] = useState(address);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleEscrow = async () => {
    setError("");
    try {
      const res = await fetch(
        "http://localhost:3001/api/escrow/create-escrow",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination, amount }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="card w-96 bg-base-100 card-xl shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Send RLUSD to Escrow</h2>

          <label>Destination Address:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Receiver's XRPL Address"
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <label>Amount (RLUSD):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to Send"
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <button onClick={handleEscrow}>Send to Escrow</button>

          {result && (
            <div style={{ marginTop: "1rem", color: "green" }}>
              ✅ Escrowed successfully. TX hash: {result.tx_json.hash}
            </div>
          )}

          {error && (
            <div style={{ marginTop: "1rem", color: "red" }}>❌ {error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Escrow;
