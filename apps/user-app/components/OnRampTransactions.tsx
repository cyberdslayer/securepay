"use client"
import { Card } from "@repo/ui/card"
import { useEffect, useState } from "react"
import { FiArrowUp, FiCheckCircle, FiClock, FiXCircle, FiRefreshCw } from 'react-icons/fi';

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
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Function to fetch latest transactions
    const fetchLatestTransactions = async () => {
        try {
            setIsRefreshing(true);
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
        } finally {
            setIsRefreshing(false);
        }
    };

    // Fetch on component mount and set up polling
    useEffect(() => {
        fetchLatestTransactions();
        
        // Check for updates every 5 seconds
        const intervalId = setInterval(fetchLatestTransactions, 5000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    // Helper function to get the appropriate icon for a transaction status
    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Success':
                return <FiCheckCircle className="h-5 w-5 text-green-500" />;
            case 'Processing':
                return <FiClock className="h-5 w-5 text-yellow-500" />;
            default:
                return <FiXCircle className="h-5 w-5 text-red-500" />;
        }
    };

    if (!transactions.length) {
        return (
            <div className="p-6 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                    <FiArrowUp className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No Recent Transactions</h3>
                <p className="text-xs text-gray-500">Your transaction history will appear here</p>
            </div>
        );
    }
    
    return (
        <div className="divide-y divide-gray-100">
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Recent Transactions</h3>
                <button 
                    onClick={fetchLatestTransactions}
                    className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    <FiRefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>
            
            {transactions.map(t => (
                <div key={t.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                t.status === "Success" ? "bg-green-100" : 
                                t.status === "Processing" ? "bg-yellow-100" : 
                                "bg-red-100"
                            } mr-3`}>
                                {getStatusIcon(t.status)}
                            </div>
                            
                            <div>
                                <div className="text-sm font-medium text-gray-800">{t.provider}</div>
                                <div className="text-xs text-gray-500">{new Date(t.time).toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className={`text-sm font-semibold ${
                                t.status === "Success" ? "text-green-600" : 
                                t.status === "Processing" ? "text-yellow-600" : 
                                "text-red-600"
                            }`}>
                                + ₹{(t.amount / 100).toFixed(2)}
                            </div>
                            <div className={`text-xs px-2 py-0.5 rounded-full inline-flex ${
                                t.status === "Success" ? "bg-green-100 text-green-800" : 
                                t.status === "Processing" ? "bg-yellow-100 text-yellow-800" : 
                                "bg-red-100 text-red-800"
                            }`}>
                                {t.status}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {transactions.length > 0 && (
                <div className="px-4 py-3 text-center">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                        View All Transactions
                    </button>
                </div>
            )}
        </div>
    );
}