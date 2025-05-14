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
        const userName = session.user.name || "Guest"; // Use the name from session or fallback to "Guest"
        
        const balance = await prisma.balance.findFirst({
            where: {
                userId: userId
            }
        });
        
        if (!balance) {
            return NextResponse.json({ amount: 0, locked: 0, name: userName });
        }
        
        return NextResponse.json({
            amount: balance.amount,
            locked: balance.locked,
            name: userName
        });
    } catch (error) {
        console.error("Failed to fetch balance:", error);
        return NextResponse.json(
            { error: "Failed to fetch balance" },
            { status: 500 }
        );
    }
}