"use client";

import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, CheckCircle, XCircle } from "lucide-react";

interface ConnectedAccount {
  provider: 'GOOGLE' | 'ZOHO' | 'OUTLOOK';
  email: string;
  status: 'connected' | 'disconnected';
  lastConnected?: string;
}

interface ConnectedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAccounts: ConnectedAccount[];
}

export function ConnectedAccountsModal({ 
  isOpen, 
  onClose, 
  connectedAccounts 
}: ConnectedAccountsModalProps) {
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'GOOGLE':
        return '🔵';
      case 'ZOHO':
        return '🟣';
      case 'OUTLOOK':
        return '🟠';
      default:
        return '📧';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'GOOGLE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ZOHO':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'OUTLOOK':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'connected' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6 max-w-md">
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Connected Email Accounts
          </h2>
        </div>
        
        <div className="space-y-4">
          {connectedAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No email accounts connected yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Connect your first account to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {connectedAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getProviderIcon(account.provider)}</span>
                    <div>
                      <p className="font-medium text-sm">{account.email}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getProviderColor(account.provider)}`}
                      >
                        {account.provider}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(account.status)}
                    <span className={`text-xs ${
                      account.status === 'connected' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {account.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Total Accounts: {connectedAccounts.length}</span>
              <span>Connected: {connectedAccounts.filter(a => a.status === 'connected').length}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
} 