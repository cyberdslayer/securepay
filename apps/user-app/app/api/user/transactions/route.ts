import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/db/client";

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    
    try {
        const userId = Number(session.user.id);
        
        const transactions = await prisma.onRampTransaction.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 10
        });
        
        return NextResponse.json(transactions.map(t => ({
            id: t.id,
            time: t.startTime,
            amount: t.amount,
            status: t.status,
            provider: t.provider
        })));
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}