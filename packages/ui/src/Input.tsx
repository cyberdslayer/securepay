"use client"

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type || "text"}
        className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";