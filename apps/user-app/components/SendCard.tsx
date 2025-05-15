"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput} from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { FiSend, FiUser, FiCreditCard, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [receiverName, setReceiverName] = useState("");

    const handleSendMoney = async () => {
        if (!number || !amount) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            setIsLoading(true);
            const result = await p2pTransfer(number, Number(amount)*100);
            
            if (result?.message === "User not found") {
                toast.error("Recipient not found. Please check the account number.");
                return;
            } else if (result?.message?.includes("Insufficient")) {
                toast.error("Insufficient funds for this transfer.");
                return;
            } else if (result?.message) {
                toast.error(result.message);
                return;
            }
            
            toast.success(`₹${amount} successfully sent to ${receiverName || number}`);
            setNumber("");
            setAmount("");
            setReceiverName("");
            
            // Refresh the page to show the updated recent transfers
            window.location.reload();
        } catch (error) {
            console.error("Transfer error:", error);
            toast.error("Failed to complete transfer. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col space-y-5">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FiSend className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Bank Transfer</h3>
                        <p className="text-sm text-gray-500">Send money to any account</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <TextInput
                            placeholder={"Receiver Name"}
                            label="Account Holder Name"
                            value={receiverName}
                            onChange={(value) => {
                                setReceiverName(value);
                            }}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            icon={<FiUser className="text-gray-400" />}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <TextInput
                            placeholder={"999 999 9999"}
                            label="Account Number"
                            value={number}
                            onChange={(value) => {
                                setNumber(value);
                            }}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            icon={<FiCreditCard className="text-gray-400" />}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <TextInput
                            placeholder={"2000"}
                            label="Amount to Transfer"
                            value={amount}
                            onChange={(value) => {
                                setAmount(value);
                            }}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            prefix="₹"
                            disabled={isLoading}
                        />
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                            {[100, 500, 1000, 2000].map((amt) => (
                                <button 
                                    key={amt}
                                    onClick={() => setAmount(amt.toString())} 
                                    className="px-2 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm rounded transition-colors"
                                    disabled={isLoading}
                                >
                                    ₹{amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={handleSendMoney}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-md shadow-sm flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="animate-spin mr-2" /> Processing...
                                </>
                            ) : (
                                <>
                                    <FiSend className="mr-2" /> Send Money
                                </>
                            )}
                        </Button>
                    </div>
                    
                    <div className="text-center mt-2">
                        <p className="text-xs text-gray-500">Instant and secure transfers between accounts</p>
                    </div>
                </div>
            </div>
        </div>
    );
}