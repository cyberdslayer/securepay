"use client"

import { Card } from "@repo/ui/card";
import { useEffect, useState } from "react";
import Balance from "./Balance";
import { FiRefreshCw, FiClock, FiUnlock, FiPieChart } from 'react-icons/fi';

export const BalanceCard = ({amount: initialAmount, locked: initialLocked}: {
    amount: number;
    locked: number;
}) => {
    const [balance, setBalance] = useState({
        amount: initialAmount,
        locked: initialLocked,
        name: ""
    });
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Function to fetch the latest balance
    const fetchLatestBalance = async () => {
        try {
            setIsRefreshing(true);
            const response = await fetch('/api/user/balance');
            if (response.ok) {
                const data = await response.json();
                setBalance(data);
            }
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Fetch on component mount and set up polling
    useEffect(() => {
        fetchLatestBalance();
        
        // Check for updates every 5 seconds
        const intervalId = setInterval(fetchLatestBalance, 5000);
        
        return () => clearInterval(intervalId);
    }, []);

    const totalBalance = (balance.locked + balance.amount) / 100;
    const unlockedBalance = balance.amount / 100;
    const lockedBalance = balance.locked / 100;
    
    // Calculate percentages for the pie chart visualization
    const unlockedPercentage = balance.amount === 0 && balance.locked === 0 
        ? 50  // Default equal split if both are zero
        : (balance.amount / (balance.amount + balance.locked)) * 100;

    return (
        <Card title="">
            <div className="p-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Balance</h3>
                    <button 
                        onClick={fetchLatestBalance} 
                        className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        <FiRefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                        Refresh
                    </button>
                </div>
                
                <div className="mb-6">
                    <Balance />
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                <FiUnlock className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-700">Unlocked Balance</div>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">₹{unlockedBalance.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <FiClock className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-700">Locked Balance</div>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">₹{lockedBalance.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                <FiPieChart className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-700">Total Balance</div>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">₹{totalBalance.toFixed(2)}</div>
                    </div>
                </div>
                
                {/* Simple visual representation of balance */}
                <div className="mt-5">
                    <div className="text-xs text-gray-500 mb-1">Balance Distribution</div>
                    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                            className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${unlockedPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <div>Available ({unlockedPercentage.toFixed(0)}%)</div>
                        <div>Locked ({(100 - unlockedPercentage).toFixed(0)}%)</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}