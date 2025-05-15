import { SendCard } from "../../../components/SendCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import Link from 'next/link';
import { FiArrowUpRight, FiClock } from 'react-icons/fi';

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

async function getUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    
    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) }
    });
    
    return user;
}

// Function to fetch recent P2P transfers
async function getRecentTransfers() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? Number(session.user.id) : null;
    
    if (userId === null) return [];
    
    const transfers = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        include: {
            fromUser: { select: { name: true, number: true } },
            toUser: { select: { name: true, number: true } }
        },
        orderBy: { timestamp: 'desc' },
        take: 5 // Limit to 5 most recent transfers
    });
    
    return transfers.map(transfer => {
        const isSender = transfer.fromUserId === userId;
        
        return {
            id: transfer.id,
            timestamp: transfer.timestamp,
            amount: transfer.amount,
            type: isSender ? 'outgoing' : 'incoming',
            counterparty: isSender 
                ? transfer.toUser.name || transfer.toUser.number
                : transfer.fromUser.name || transfer.fromUser.number
        };
    });
}

export default async function P2PPage() {
    const balance = await getBalance();
    const user = await getUser();
    const recentTransfers = await getRecentTransfers();
    
    return (
        <div className="w-full">
            {/* Page Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Peer-to-Peer Transfer</h1>
                <p className="text-indigo-100">Send money instantly to friends and family</p>
                
                <div className="mt-4 flex items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4">
                        <span className="text-sm">Available Balance:</span>
                        <span className="text-xl font-bold ml-2">₹{(balance?.amount || 0) / 100}</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Send Money</h2>
                    <SendCard />
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transfers</h2>
                    <div className="flex flex-col gap-4">
                        {recentTransfers.length > 0 ? (
                            recentTransfers.map((transfer) => (
                                <div key={transfer.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                            transfer.type === 'outgoing' 
                                                ? 'bg-indigo-100 text-indigo-600' 
                                                : 'bg-green-100 text-green-600'
                                        }`}>
                                            {transfer.type === 'outgoing' ? (
                                                <FiArrowUpRight className="h-5 w-5" />
                                            ) : (
                                                <FiArrowUpRight className="h-5 w-5 transform rotate-180" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {transfer.type === 'outgoing' ? 'To: ' : 'From: '}{transfer.counterparty}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(transfer.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`text-sm font-medium ${
                                            transfer.type === 'outgoing' ? 'text-indigo-600' : 'text-green-600'
                                        }`}>
                                            {transfer.type === 'outgoing' ? '-' : '+'} ₹{(transfer.amount / 100).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 border border-gray-100 rounded-lg">
                                <div className="text-center py-4">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                                        <FiClock className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="text-sm text-gray-500">You don't have any recent transfers</div>
                                    <div className="mt-2 text-indigo-600 text-xs">Send your first payment to get started</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}