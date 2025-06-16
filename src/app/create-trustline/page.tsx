"use client";

import React, { useState } from "react";
import TrustlineCreator from "../../components/TrustlineCreator";

const issuer = process.env.RLUSD_ISSUER_ADDRESS;

function CreateTrustline() {
  return <TrustlineCreator issuer={issuer} />;
}

export default CreateTrustline;
