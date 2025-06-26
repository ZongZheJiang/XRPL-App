// app/page.tsx
import BalanceChecker from "@/components/BalanceChecker";
import TransferRLUSD from "@/components/TransferRLUSD"; // Import the new component
import PaymentForm from "@/components/PaymentForm";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">XRPL Tools</h1>
      <div className="w-full max-w-md space-y-8">
        <BalanceChecker />
        <TransferRLUSD /> 
        <PaymentForm />
      </div>
    </main>
  );
}
