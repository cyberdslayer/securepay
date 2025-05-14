"use client"
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ 
  href, 
  title, 
  icon, 
  collapsed = false 
}: { 
  href: string; 
  title: string; 
  icon: React.ReactNode;
  collapsed?: boolean;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const selected = pathname === href;

    return (
      <div 
        className={`
          flex items-center cursor-pointer transition-all mb-2
          ${selected ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-gray-50"} 
          ${collapsed ? "justify-center py-4" : "px-6 py-3"}
          rounded-lg mx-2
        `} 
        onClick={() => {
          router.push(href);
        }}
        title={collapsed ? title : ""}
      >
        <div className={collapsed ? "" : "mr-3"}>
          {icon}
        </div>
        {!collapsed && (
          <div className={`font-medium ${selected ? "text-indigo-600" : "text-slate-700"}`}>
            {title}
          </div>
        )}
      </div>
    );
}