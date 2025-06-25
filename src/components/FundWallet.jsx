import React, { useState } from "react";

export default function FundWallet() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      setMessage("Please enter a wallet address.");
      return;
    }
    setLoading(true);
    setMessage("Sending request...");
    setAddress(address);
    try {
      const response = await fetch(`/api/fund-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const text = await response.text();
      console.log("Response text:", text);

      if (!text) {
        setMessage("Error: Empty response from backend.");
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        setMessage(`Success! ${data.message}`);
      } else {
        setMessage(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="card w-96 bg-base-100 card-xl shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Fund Wallet with Test XRP</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: "10px", padding: "8px 16px" }}
            >
              {loading ? "Requesting..." : "Request Test XRP"}
            </button>
          </form>
          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
