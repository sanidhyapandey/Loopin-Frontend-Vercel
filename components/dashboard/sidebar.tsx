"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Users, FileText } from "lucide-react";
import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { useUserName } from "@/lib/getUserName";
import { useUserEmail } from "@/lib/getUserEmail";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Dashboard', icon: Calendar, path: '/dashboard' },
    { name: 'Email', icon: Mail, path: '/emails' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Notes', icon: FileText, path: '/notes' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Loopin</h1>
        <p className="text-xs text-gray-500">AI Personal Assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>{userName.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <SignedIn>
            <div className="flex-1">
              <UserButton />
            </div>
          </SignedIn>

          <SignedIn>
            <div className="flex-1">
              <SignOutButton>
                Sign Out
              </SignOutButton>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
} 