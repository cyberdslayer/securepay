"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction";
import { FiCreditCard, FiArrowRight } from 'react-icons/fi';

const SUPPORTED_BANKS = [{
    name: "SBI Bank",
    redirectUrl: "https://retail.onlinesbi.sbi/retail/login.htm"
},{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0);

    return (
        <Card title="">
            <div className="w-full">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FiCreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Add Money</h2>
                        <p className="text-sm text-gray-500">Choose your payment method</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <TextInput 
                            label={"Amount"} 
                            placeholder={"Enter amount"} 
                            onChange={(val) => {
                                setValue(Number(val))
                            }}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        />
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                            {[100, 500, 1000, 2000].map((amount) => (
                                <button 
                                    key={amount}
                                    onClick={() => setValue(amount)} 
                                    className="px-2 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm rounded transition-colors"
                                >
                                    ₹{amount}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank
                        </label>
                        <Select 
                            onSelect={(value) => {
                                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
                                setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
                            }} 
                            options={SUPPORTED_BANKS.map(x => ({
                                key: x.name,
                                value: x.name
                            }))}
                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>

                    <div className="flex justify-center pt-3">
                        <Button 
                            onClick={async () => {
                                await createOnRampTransaction(provider, value)
                                window.location.href = redirectUrl || "";
                            }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center justify-center"
                        >
                            Add Money <FiArrowRight className="ml-2" />
                        </Button>
                    </div>

                    <div className="text-center mt-2">
                        <p className="text-xs text-gray-500">Safe and secure payments</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}