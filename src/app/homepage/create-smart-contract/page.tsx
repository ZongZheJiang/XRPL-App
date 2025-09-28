"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';
import CreateSmartContract from "@/components/CreateSmartContract"; // Adjust the import path as needed

function Escrow() {
  return (
    <div>
      <h1>Create Smart Contract</h1>
      <Suspense fallback={<div>Loading form...</div>}>
        <CreateSmartContract />
      </Suspense>
    </div>

  );
}

export default Escrow;
