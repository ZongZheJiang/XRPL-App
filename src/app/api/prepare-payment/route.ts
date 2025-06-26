import { NextResponse } from "next/server";
import { Client, isValidAddress, xrpToDrops, IssuedCurrencyAmount } from "xrpl";

// Read the server's configuration from environment variables
const XRPL_CLIENT_URL = process.env.XRPL_CLIENT_URL;
const RLUSD_ISSUER_ADDRESS = process.env.RLUSD_ISSUER_ADDRESS;

export async function POST(request: Request) {
  // 1. Check that the server is configured correctly
  if (!XRPL_CLIENT_URL || !RLUSD_ISSUER_ADDRESS) {
    console.error("Server is not configured. Check .env.local file.");
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    // 2. Get ONLY PUBLIC data from the request
    const { senderAddress, receiverAddress, amount, currency } = body;

    // 3. Validate the public data
    if (!senderAddress || !receiverAddress || !amount || !currency) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }
    if (!isValidAddress(senderAddress) || !isValidAddress(receiverAddress)) {
      return NextResponse.json({ message: "Invalid sender or receiver address." }, { status: 400 });
    }
    if (currency !== 'XRP' && currency !== 'RLUSD') {
        return NextResponse.json({ message: "Unsupported currency." }, { status: 400 });
    }

    // 4. Connect to the XRPL to do the preparation work
    const client = new Client(XRPL_CLIENT_URL);
    await client.connect();

    // 5. Construct the specific amount based on the currency
    let paymentAmount: string | IssuedCurrencyAmount;
    if (currency === "XRP") {
      paymentAmount = xrpToDrops(amount);
    } else { // RLUSD
      paymentAmount = {
        currency: "RLUSD",
        value: amount,
        issuer: RLUSD_ISSUER_ADDRESS, // Use the server's configured issuer address
      };
    }

    // 6. Create the unsigned transaction object
    const preparedTx = await client.autofill({
      TransactionType: "Payment",
      Account: senderAddress,
      Amount: paymentAmount,
      Destination: receiverAddress,
    });

    await client.disconnect();

    // 7. Send the prepared, unsigned transaction back to the client
    return NextResponse.json(preparedTx);

  } catch (error: any) {
    console.error("API Prepare Error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while preparing the transaction." },
      { status: 500 },
    );
  }
}