import { NextResponse } from "next/server";
import {
  Client,
  Wallet,
  isValidAddress,
  xrpToDrops,
  IssuedCurrencyAmount,
} from "xrpl";

const XRPL_CLIENT_URL = process.env.XRPL_CLIENT_URL;

// This will be the issuer address for your RLUSD token
// It's best practice to store this in an environment variable
const RLUSD_ISSUER_ADDRESS = process.env.NEXT_PUBLIC_RLUSD_ISSUER_ADDRESS;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderSeed, receiverAddress, amount, currency } = body;

    // --- 1. Validate all inputs ---
    if (!senderSeed || !receiverAddress || !amount || !currency) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }
    if (!isValidAddress(receiverAddress)) {
      return NextResponse.json(
        { message: "Invalid receiver address." },
        { status: 400 },
      );
    }
    // A basic check to see if the seed format is plausible (starts with 's')
    if (typeof senderSeed !== "string" || !senderSeed.startsWith("s")) {
      return NextResponse.json(
        { message: "Invalid sender seed." },
        { status: 400 },
      );
    }

    if (!XRPL_CLIENT_URL || !RLUSD_ISSUER_ADDRESS) {
      return NextResponse.json(
        { message: "Server is not configured correctly." },
        { status: 500 },
      );
    }

    // --- 2. Connect to XRPL and prepare wallet ---
    const client = new Client(XRPL_CLIENT_URL);
    await client.connect();

    const senderWallet = Wallet.fromSeed(senderSeed);

    // --- 3. Construct the payment transaction based on currency ---
    let paymentAmount: string | IssuedCurrencyAmount;

    if (currency === "XRP") {
      paymentAmount = xrpToDrops(amount); // Convert XRP to drops
    } else if (currency === "RLUSD") {
      paymentAmount = {
        currency: "RLUSD", // The currency code
        value: amount, // The amount as a string
        issuer: RLUSD_ISSUER_ADDRESS, // The address of the token issuer
      };
    } else {
      return NextResponse.json(
        { message: "Unsupported currency." },
        { status: 400 },
      );
    }

    // --- 4. Prepare and submit the transaction ---
    const preparedTx = await client.autofill({
      TransactionType: "Payment",
      Account: senderWallet.classicAddress,
      Amount: paymentAmount,
      Destination: receiverAddress,
    });

    const signedTx = senderWallet.sign(preparedTx);
    const result = await client.submitAndWait(signedTx.tx_blob);

    await client.disconnect();

    // --- 5. Return a success response ---
    return NextResponse.json({
      message: "Payment submitted successfully!",
      result: result.result, // Send back the transaction result from the ledger
    });
  } catch (error: any) {
    console.error("API Payment Error:", error);
    // Provide more specific error messages from the ledger if available
    const errorMessage =
      error.data?.tec_message ||
      error.message ||
      "An error occurred while sending the payment.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
