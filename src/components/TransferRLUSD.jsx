"use client";

import React, { useState } from "react";

const TransferRLUSD = () => {
  const [senderSeed, setSenderSeed] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("XRP"); // Default to XRP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSendPayment = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/send-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderSeed, receiverAddress, amount, currency }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send payment.");
      }

      setSuccess(data.message); // Set success message from API
      // Optional: clear form on success
      setSenderSeed("");
      setReceiverAddress("");
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="card w-96 bg-base-100 card-xl shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Transfer RLUSD</h2>
          <form onSubmit={handleSendPayment}>
            {/* Currency Selector */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Currency</span>
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="select select-bordered"
              >
                <option value="XRP">XRP</option>
                <option value="RLUSD">RLUSD</option>
              </select>
            </div>

            {/* Sender's Seed */}
            <div className="form-control w-full mt-4">
              <label className="label" htmlFor="senderSeed">
                <span className="label-text">Your Secret Seed</span>
              </label>
              <input
                type="password" // Use password type for secrets
                id="senderSeed"
                value={senderSeed}
                onChange={(e) => setSenderSeed(e.target.value)}
                placeholder="s... (kept private on server)"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Receiver's Address */}
            <div className="form-control w-full mt-4">
              <label className="label" htmlFor="receiverAddress">
                <span className="label-text">Receiver's Address</span>
              </label>
              <input
                type="text"
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="r... (destination address)"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Amount */}
            <div className="form-control w-full mt-4">
              <label className="label" htmlFor="amount">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="card-actions justify-end mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Send Payment"}
              </button>
            </div>
          </form>

          {/* Feedback Messages */}
          {error && <div className="text-red-500 mt-4">{error}</div>}
          {success && <div className="text-green-500 mt-4">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default TransferRLUSD;
