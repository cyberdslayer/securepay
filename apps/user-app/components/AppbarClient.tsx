"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AppbarClient({ 
  toggleSidebar, 
  sidebarCollapsed 
}: { 
  toggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}) {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Left section with logo and hamburger menu */}
        <div className="flex items-center">
          {toggleSidebar && (
            <button 
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          )}
          <div className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            SecurePay
          </div>
        </div>
        
        {/* Right section with notifications and user profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          
          {/* User profile and dropdown */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              {session.data?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-700">{session.data?.user?.name || "Guest"}</div>
              <div className="text-xs text-gray-500">
                {session.status === "authenticated" ? "Online" : "Not signed in"}
              </div>
            </div>
            
            <button 
              onClick={session.data?.user ? async () => {
                await signOut({ redirect: false });
                router.push("http://localhost:3001/");
              } : () => signIn()}
              className="ml-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors"
            >
              {session.data?.user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
