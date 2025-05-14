"use client";

import { useEffect, useState } from "react";

function Balance() {
    const [balance, setBalance] = useState({ amount: 0, locked: 0, name: "Guest" });
    
    const fetchBalance = async () => {
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

    // Fetch on component mount
    useEffect(() => {
        fetchBalance();
        
        // Set up polling to refresh balance every 5 seconds
        const intervalId = setInterval(fetchBalance, 5000);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div className="text-lg font-medium mb-2">
                Hello, {balance.name || "Guest"}
            </div>
            <div className="text-sm text-gray-500 mb-2">
                Last updated: {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
}

export default Balance;