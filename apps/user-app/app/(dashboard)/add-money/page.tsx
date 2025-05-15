import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import Link from 'next/link';

async function getBalance() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (userId === null) return null;

    const balance = await prisma.balance.findFirst({
        where: {    
            userId: Number(userId)
        }
    });

    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
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
        },
        take: 5
    });
    
    return txns.map(t => ({
        id: t.id,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

export default async function TransferPage() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return (
        <div className="w-full">
            {/* Page Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Add Money</h1>
                <p className="text-indigo-100">Add funds to your PaySmart account and track your balance</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4">
                        <span className="text-sm">Available:</span>
                        <span className="text-xl font-bold ml-2">₹{(balance?.amount || 0) / 100}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4">
                        <span className="text-sm">Locked:</span>
                        <span className="text-xl font-bold ml-2">₹{(balance?.locked || 0) / 100}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4">
                        <span className="text-sm">Total:</span>
                        <span className="text-xl font-bold ml-2">₹{((balance?.amount || 0) + (balance?.locked || 0)) / 100}</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Money Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Add Funds</h2>
                    <AddMoney />
                </div>
                
                {/* Right Column - Balance and Transactions */}
                <div className="space-y-6">
                    {/* Balance Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Balance Summary</h2>
                        {balance && <BalanceCard amount={balance.amount} locked={balance.locked} />}
                    </div>
                    
                    {/* Transactions */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 pb-0">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                                <Link href="/transactions" className="text-sm text-indigo-600 hover:underline">View All</Link>
                            </div>
                        </div>
                        <OnRampTransactions transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}