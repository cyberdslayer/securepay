"use client"

import { Card } from "@repo/ui/card";
import { useEffect, useState } from "react";
import Balance from "./Balance";

export const BalanceCard = ({amount: initialAmount, locked: initialLocked}: {
    amount: number;
    locked: number;
}) => {
    const [balance, setBalance] = useState({
        amount: initialAmount,
        locked: initialLocked,
        name: ""
    });

    // Function to fetch the latest balance
    const fetchLatestBalance = async () => {
        try {
            const response = await fetch('/api/user/balance');
            if (response.ok) {
                const data = await response.json();
                setBalance(data);
            }
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    };

    // Fetch on component mount and set up polling
    useEffect(() => {
        fetchLatestBalance();
        
        // Check for updates every 5 seconds
        const intervalId = setInterval(fetchLatestBalance, 5000);
        
        return () => clearInterval(intervalId);
    }, []);

    return <Card title={"Balance"}>
            <div>
                <Balance />
            </div>
                
        <div className="flex justify-between border-b border-slate-300 pb-2">
            <div>
                Unlocked balance
            </div>
            <div>
                {balance.amount / 100} INR
            </div>
        </div>
        <div className="flex justify-between border-b border-slate-300 py-2">
            <div>
                Total Locked Balance
            </div>
            <div>
                {balance.locked / 100} INR
            </div>
        </div>
        <div className="flex justify-between border-b border-slate-300 py-2">
            <div>
                Total Balance
            </div>
            <div>
                {(balance.locked + balance.amount) / 100} INR
            </div>
        </div>
    </Card>
}