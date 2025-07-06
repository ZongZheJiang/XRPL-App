"use client";

import React, { useState } from "react";
import FundWallet from "../../components/FundWallet";
import SendRLUSD from "../../components/SendRLUSD";
import PaymentForm from "@/components/PaymentForm";

const handleFundWallet = () => {
  const [wallet, setWallet] = useState(null);

  return (
    <div style={{ padding: 20, paddingTop: 96 }}>
      <h1>Decentralized Aid Disbursement MVP</h1>
      <FundWallet />
      <hr />
      <PaymentForm wallet={wallet} />
    </div>
  );
};

export default FundWallet;
