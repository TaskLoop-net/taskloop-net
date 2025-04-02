
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, CreditCard, Users, Moon, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileMenuProps {
  user: {
    name: string;
    email: string;
    initials: string;
  };
  onSettings: () => void;
  onBilling: () => void;
  onTeam: () => void;
  onDarkMode: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

const UserProfileMenu = ({
  user,
  onSettings,
  onBilling,
  onTeam,
  onDarkMode,
  onLogout,
  isDarkMode,
}: UserProfileMenuProps) => {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex flex-col px-2 py-2 space-y-1">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onSettings} className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onBilling} className="cursor-pointer">
          <CreditCard className="h-4 w-4 mr-2" />
          <span>Account and Billing</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onTeam} className="cursor-pointer">
          <Users className="h-4 w-4 mr-2" />
          <span>Manage Team</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onTeam} className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          <span>Product Updates</span>
          <span className="ml-auto flex h-2 w-2 bg-red-500 rounded-full"></span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onDarkMode} className="cursor-pointer">
          <Moon className="h-4 w-4 mr-2" />
          <span>Dark Mode</span>
          <div className="ml-auto w-8 h-4 bg-gray-200 rounded-full p-0.5 flex items-center">
            <div className={`w-3 h-3 rounded-full transition-transform ${isDarkMode ? 'transform translate-x-4 bg-indigo-500' : 'bg-white'}`}></div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
