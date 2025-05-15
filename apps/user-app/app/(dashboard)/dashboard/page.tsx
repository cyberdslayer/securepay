import { Card } from "@repo/ui/card";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

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
  };
}

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  
  return {
    name: session.user.name || "User",
    email: session.user.email
  };
}

async function getRecentTransactions() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session.user.id)
    },
    orderBy: {
      startTime: 'desc'
    },
    take: 3
  });
}

export default async function Dashboard() {
  const balance = await getBalance();
  const user = await getUser();
  const recentTransactions = await getRecentTransactions();
  
  // Format the current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  // Get time of day for greeting
  const hour = today.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p className="text-indigo-100 mb-2">{formattedDate}</p>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {user?.name || "User"}
            </h1>
            <p className="text-indigo-100">Welcome to your SecurePay dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm">Total Balance</p>
            <h2 className="text-3xl font-bold">₹{((balance?.amount || 0) + (balance?.locked || 0)) / 100}</h2>
            <div className="flex gap-4 mt-2 text-sm">
              <div>
                <p>Available</p>
                <p className="font-medium">₹{(balance?.amount || 0) / 100}</p>
              </div>
              <div>
                <p>Locked</p>
                <p className="font-medium">₹{(balance?.locked || 0) / 100}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Financial Overview</h2>
            <div className="flex space-x-2">
              {["1W", "1M", "3M", "6M", "1Y", "ALL"].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    range === "1M" 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          {/* Placeholder for chart - in real app you'd use a chart library */}
          <div className="h-64 bg-gradient-to-b from-indigo-50 to-white rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p>Your financial activity will appear here</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Monthly Savings</p>
              <p className="text-xl font-bold">₹{(balance?.amount || 0) / 400}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Monthly Spend</p>
              <p className="text-xl font-bold">₹{(balance?.locked || 0) / 200}</p>
              <p className="text-xs text-red-600 mt-1">-3% from last month</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Goal Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">45% of monthly goal reached</p>
            </div>
          </div>
        </div>

        {/* Right sidebar with quick actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-indigo-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm font-medium text-gray-700">Add Money</p>
              </button>
              <button className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-indigo-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <p className="text-sm font-medium text-gray-700">Transfer</p>
              </button>
              <button className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-indigo-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm font-medium text-gray-700">History</p>
              </button>
              <button className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-indigo-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-700">Settings</p>
              </button>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
              <a href="/transactions" className="text-indigo-600 text-sm hover:underline">View all</a>
            </div>
            
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-all">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.status === "Success" ? "bg-green-100 text-green-600" : 
                        txn.status === "Processing" ? "bg-yellow-100 text-yellow-600" : 
                        "bg-red-100 text-red-600"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">{txn.provider}</p>
                        <p className="text-xs text-gray-500">{new Date(txn.startTime).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      txn.status === "Success" ? "text-green-600" : 
                      txn.status === "Processing" ? "text-yellow-600" : 
                      "text-red-600"
                    }`}>
                      +₹{txn.amount / 100}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent transactions</p>
              </div>
            )}
          </div>
          
          {/* Premium Feature Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-sm p-6 text-white">
            <h2 className="text-lg font-bold mb-2">Set up recurring transfers</h2>
            <p className="text-sm mb-4 text-purple-100">
              Schedule automatic transfers to save time and build your savings consistently.
            </p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-all text-sm font-medium">
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
