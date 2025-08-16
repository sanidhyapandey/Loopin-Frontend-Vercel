"use client";

import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";

interface HeaderProps {
  loading: boolean;
  onConnectAccount: () => void;
  onShowConnectedAccounts: () => void;
}

export function Header({ loading, onConnectAccount, onShowConnectedAccounts }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 pl-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Button variant="outline" size="sm" onClick={onShowConnectedAccounts} disabled={loading}>
            Connected Accounts
          </Button>
          <Button variant="outline" size="sm" onClick={onConnectAccount} disabled={loading}>
            Connect Account
          </Button>
          {/* <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              // Test button functionality
            }}
          >
            Test Button (API calls removed)
          </Button> */}
        </div>
      </div>
    </header>
  );
} 