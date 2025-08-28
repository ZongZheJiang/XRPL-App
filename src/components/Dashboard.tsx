import FundWallet from "@/components/FundWallet";
import BalanceChecker from "@/components/BalanceChecker";
import TransferRLUSD from "@/components/TransferRLUSD"; 
import PaymentForm from "@/components/PaymentForm";
import { User } from "@supabase/supabase-js";

export default function Dashboard({ user }: { user: User }) {
    return(
        <div>
            <FundWallet />
            <BalanceChecker />
            <TransferRLUSD />
            <PaymentForm />
        </div>
    )
}