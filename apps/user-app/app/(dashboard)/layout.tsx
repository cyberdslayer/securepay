"use client"
import { SidebarItem } from "../../components/SidebarItem";
import { useState, useEffect } from "react";
import { AppbarClient } from "../../components/AppbarClient";
import { Toaster } from 'react-hot-toast';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <AppbarClient toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      </div>

      <div className="flex pt-16">
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && !sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20" 
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar - collapsible */}
        <div 
          className={`fixed left-0 top-16 bottom-0 bg-white shadow-md transition-all duration-300 ease-in-out z-20 ${
            sidebarCollapsed ? "w-20" : "w-72"
          } ${isMobile && sidebarCollapsed ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div className="py-4 h-full overflow-y-auto scrollbar-thin">
            <SidebarItem 
              href={"/dashboard"} 
              icon={<HomeIcon />} 
              title="Home" 
              collapsed={sidebarCollapsed} 
            />
            <SidebarItem 
              href={"/add-money"} 
              icon={<TransferIcon />} 
              title="Add Money" 
              collapsed={sidebarCollapsed} 
            />
            <SidebarItem 
              href={"/transactions"} 
              icon={<TransactionsIcon />} 
              title="Transactions" 
              collapsed={sidebarCollapsed} 
            />
            <SidebarItem 
              href={"/p2p"} 
              icon={<P2PTransferIcon />} 
              title="P2P Transfer" 
              collapsed={sidebarCollapsed} 
            />

            {/* Collapse toggle button */}
            <div className="absolute bottom-4 w-full flex justify-center">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main content - adjusted based on sidebar state */}
        <div className={`transition-all duration-300 ease-in-out flex-1 ${
          !isMobile ? (sidebarCollapsed ? "ml-20" : "ml-72") : "ml-0"
        } p-4 md:p-6`}>
          {children}
        </div>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );  
}

// Icons Fetched from https://heroicons.com/
function HomeIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
}
function TransferIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
}

function TransactionsIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinejoin="round" strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
  
}

function P2PTransferIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinejoin="round" strokeLinecap="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
}