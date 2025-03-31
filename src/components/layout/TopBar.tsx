
import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TopBar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-10 border-gray-300 focus:border-taskloop-blue focus:ring-taskloop-blue"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-taskloop-darkblue flex items-center justify-center text-white font-medium">
            JS
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
