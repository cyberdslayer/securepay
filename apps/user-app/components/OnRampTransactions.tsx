"use client"
import { Card } from "@repo/ui/card"
import { useEffect, useState } from "react"

type Transaction = {
    id: number,
    time: Date,
    amount: number,
    status: string,
    provider: string
}

export const OnRampTransactions = ({
    transactions: initialTransactions
}: {
    transactions: Transaction[]
}) => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

    // Function to fetch latest transactions
    const fetchLatestTransactions = async () => {
        try {
            const response = await fetch('/api/user/transactions');
            if (response.ok) {
                const data = await response.json();
                setTransactions(data.map((t: any) => ({
                    ...t,
                    time: new Date(t.time)
                })));
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
    };

    // Fetch on component mount and set up polling
    useEffect(() => {
        fetchLatestTransactions();
        
        // Check for updates every 5 seconds
        const intervalId = setInterval(fetchLatestTransactions, 5000);
        
        return () => clearInterval(intervalId);
    }, []);

    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    
    return <Card title="Recent Transactions">
        <div className="pt-2" >
            {transactions.map(t => <div key={t.id} className="flex justify-between py-2 border-b border-slate-100">
                <div>
                    <div className="text-sm">
                        {t.provider} - {t.status}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {new Date(t.time).toLocaleString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <span className={`${t.status === "Success" ? "text-green-600" : t.status === "Processing" ? "text-yellow-600" : "text-red-600"}`}>
                        + Rs {t.amount / 100}
                    </span>
                </div>
            </div>)}
        </div>
    </Card>
}