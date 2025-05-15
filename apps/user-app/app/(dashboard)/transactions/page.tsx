import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import TransactionHistory from "../../../components/TransactionHistory";
import { FiFilter, FiDownload, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

async function getBalance() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? Number(session.user.id) : null;
    
    if (userId === null) return null;
    
    const balance = await prisma.balance.findFirst({
        where: { userId: Number(userId) }
    });
    
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    };
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];
    
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session.user.id)
        },
        orderBy: {
            startTime: 'desc'
        }
    });
    
    return txns.map(t => ({
        id: t.id,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

export default async function TransactionsPage() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    // Count transactions by status
    const statusCounts = {
        success: transactions.filter(t => t.status === "Success").length,
        processing: transactions.filter(t => t.status === "Processing").length,
        // failed: transactions.filter(t => t.status === "Failed").length,
        total: transactions.length
    };
    return (
        <div className="w-full">
            {/* Page Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Transaction History</h1>
                <p className="text-indigo-100">View and track all your transactions</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4">
                        <span className="text-sm">Total Balance:</span>
                        <span className="text-xl font-bold ml-2">₹{((balance?.amount || 0) + (balance?.locked || 0)) / 100}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4">
                        <span className="text-sm">Transactions:</span>
                        <span className="text-xl font-bold ml-2">{transactions.length}</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {/* Transaction Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                        <button className="text-sm text-indigo-600 hover:underline">Reset</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 text-sm font-medium">
                            All
                        </button>
                        <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-all">
                            Success
                        </button>
                        <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-all">
                            Processing
                        </button>
                        <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-all">
                            Failed
                        </button>
                    </div>
                </div>
                
                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    );
}