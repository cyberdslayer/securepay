"use client"

import React, { useEffect, useState } from 'react';
import { FiArrowUpRight, FiArrowDownLeft, FiFilter, FiDownload } from 'react-icons/fi';

interface Transaction {
  id: number;
  type: 'add' | 'transfer';
  amount: number;
  timestamp: string;
  status: 'success' | 'failed';
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/transactions');
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Transaction type icon based on type
  const getTransactionIcon = (type: string) => {
    return type === 'add' ? 
      <FiArrowDownLeft className="h-4 w-4 text-green-500" /> : 
      <FiArrowUpRight className="h-4 w-4 text-indigo-500" />;
  };

  return (
    <div className="w-full">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
        
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FiFilter className="mr-1.5 h-4 w-4 text-gray-500" />
            Filter
          </button>
          <button className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FiDownload className="mr-1.5 h-4 w-4 text-gray-500" />
            Export
          </button>
        </div>
      </div>

      {/* Transaction table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {transaction.type === 'add' ? 'Money Added' : 'Money Sent'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${transaction.type === 'add' ? 'text-green-600' : 'text-indigo-600'}`}>
                      {transaction.type === 'add' ? '+' : '-'} ₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{new Date(transaction.timestamp).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'success' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'success' ? 'Successful' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(transactions.length, 10)}</span> of{' '}
                  <span className="font-medium">{transactions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <FiArrowUpRight className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No Transactions Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Your transaction history will appear here once you start making transfers or adding money.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;