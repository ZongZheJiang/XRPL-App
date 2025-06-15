// app/dev/page.tsx
import { readWallets, readEscrows } from '@/lib/db';
import { getXrpBalance } from '@/lib/xrpl';

// This is an async Server Component - it runs on the server at request time.
export default async function DevDashboardPage() {
  // Fetch data directly on the server
  const walletsDict = await readWallets();
  const escrows = await readEscrows();

  // Enhance wallet data with live balances
  const wallets = await Promise.all(
    Object.values(walletsDict).map(async (w) => ({
      ...w,
      balance: await getXrpBalance(w.classicAddress),
    }))
  );

  return (
    <div className="container mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Developer Dashboard</h1>

      <h2 className="text-2xl font-semibold mb-4">Wallets ({wallets.length})</h2>
      <div className="overflow-x-auto shadow-md rounded-lg mb-8">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Address</th>
              <th scope="col" className="px-6 py-3">Secret</th>
              <th scope="col" className="px-6 py-3">Balance (XRP)</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w) => (
              <tr key={w.classicAddress} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-mono">{w.classicAddress}</td>
                <td className="px-6 py-4 font-mono">{w.seed}</td>
                <td className="px-6 py-4">{w.balance.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Escrows ({Object.keys(escrows).length})</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Sequence</th>
              <th scope="col" className="px-6 py-3">Owner</th>
              <th scope="col" className="px-6 py-3">Destination</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(escrows).map(([seq, info]) => (
                <tr key={seq} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{seq}</td>
                    <td className="px-6 py-4 font-mono">{info.owner}</td>
                    <td className="px-6 py-4 font-mono">{info.dest}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}