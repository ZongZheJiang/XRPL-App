// app/api/check-balances/route.ts
import { NextResponse } from "next/server";
import { Client, dropsToXrp } from "xrpl";

const XRPL_CLIENT_URL = process.env.XRPL_CLIENT_URL;

export async function POST(request: Request) {
  const body = await request.json();
  const address = body.address;

  // --- 2. Validate the input ---
  if (!address) {
    return NextResponse.json(
      { message: "Query parameter 'address' is required." },
      { status: 400 }, // Bad Request
    );
  }

  // --- 3. Connect to the XRPL ---
  const client = new Client(XRPL_CLIENT_URL);
  try {
    await client.connect();

    // --- 4. Get the XRP balance using the 'account_info' command ---
    const accountInfo = await client.request({
      command: "account_info",
      account: address,
      ledger_index: "validated", // Use the latest validated ledger
    });

    // Convert the balance from "drops" to human-readable XRP
    const xrpBalance = dropsToXrp(accountInfo.result.account_data.Balance);

    // --- 5. Get issued currency balances using the 'account_lines' command ---
    const accountLines = await client.request({
      command: "account_lines",
      account: address,
      ledger_index: "validated",
    });

    // Format the trust lines into a cleaner array
    const issuedBalances = accountLines.result.lines.map((line) => ({
      currency: line.currency,
      value: line.balance,
      issuer: line.account,
    }));

    // --- 6. Return the combined result ---
    return NextResponse.json({
      address: address,
      xrpBalance: xrpBalance,
      issuedBalances: issuedBalances,
    });
  } catch (error: any) {
    // --- 7. Handle errors gracefully ---
    console.error("XRPL request failed:", error);

    // Check for a common error: account not found on the ledger
    if (error.data?.error === "actNotFound") {
      return NextResponse.json(
        { message: `Account ${address} not found on the ledger.` },
        { status: 404 }, // Not Found
      );
    }

    if (!XRPL_CLIENT_URL) {
    console.error("CRITICAL: XRPL_CLIENT_URL environment variable is not set.");
    return NextResponse.json(
      { message: "Server is not configured correctly." },
      { status: 500 }
    );
  }

    return NextResponse.json(
      { message: "An error occurred while fetching the balance." },
      { status: 500 }, // Internal Server Error
    );
  } finally {
    // --- 8. Ensure the client is always disconnected ---
    if (client.isConnected()) {
      await client.disconnect();
    }
  }
}
