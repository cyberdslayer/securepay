import { SendCard } from "../../../components/SendCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

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

export default async function P2PPage() {
    const balance = await getBalance();
    
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
                <div className="col-span-1">
                    <SendCard />
                </div>
                
                <div className="col-span-1 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transfers</h2>
                    <div className="flex flex-col gap-4">
                        <div className="p-4 border border-gray-100 rounded-lg">
                            <div className="text-sm text-gray-500">You don't have any recent transfers</div>
                            <div className="mt-2 text-indigo-600 text-xs">Send your first payment to get started</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}