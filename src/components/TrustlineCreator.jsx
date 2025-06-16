import React, { useState } from "react";
// import axios from "axios";

const issuer = process.env.RLUSD_ISSUER_ADDRESS;

const TrustlineCreator = ({ issuer }) => {
  const [address, setAddress] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const createTrustline = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/create_trustline", {
        address,
        secret,
        issuer,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({ error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="card w-96 bg-base-100 card-xl shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Create Trustline</h2>
          <div className="mb-4">
            <label className="block font-medium">Destination Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="r..."
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Destination Secret</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="s..."
            />
          </div>
          <button
            onClick={createTrustline}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {loading ? "Creating..." : "Create Trustline"}
          </button>

          {response && (
            <div className="mt-4 p-3 border rounded bg-gray-50">
              {response.error ? (
                <p className="text-red-500">Error: {response.error}</p>
              ) : (
                <div>
                  <p className="text-green-600 font-medium">
                    ✅ Trustline Created!
                  </p>
                  <pre className="text-sm">
                    {JSON.stringify(response.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustlineCreator;
