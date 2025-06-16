"use client";

import React, { useState } from "react";
import FundWallet from "../../components/FundWallet";
import SendRLUSD from "../../components/SendRLUSD";

const ISSUER_ADDRESS = "rEBQEFvhgZKEbUMSFcwe5SM7FyEDN26zRL";

const handleFundWallet = () => {
  const [wallet, setWallet] = useState(null);

  return (
    <div style={{ padding: 20, paddingTop: 96 }}>
      <h1>Decentralized Aid Disbursement MVP</h1>
      <FundWallet />
      <hr />
      <SendRLUSD wallet={wallet} /> {/* Pass wallet here */}
    </div>
  );
};

export default FundWallet;
