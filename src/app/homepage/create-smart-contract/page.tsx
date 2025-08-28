"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import CreateSmartContract from "@/components/CreateSmartContract"; // Adjust the import path as needed

function Escrow() {
  return (
    <CreateSmartContract />
  );
}

export default Escrow;
