import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Briefcase, 
  PenTool, 
  DollarSign,
  Settings,
  BarChart,
  Plus,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateDropdown from './CreateDropdown';

const Sidebar = () => {
  const location = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const navigationItems = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: 'Schedule', icon: <Calendar className="h-5 w-5" />, path: '/schedule' },
    { name: 'Clients', icon: <Users className="h-5 w-5" />, path: '/clients' },
    { name: 'Requests', icon: <FileText className="h-5 w-5" />, path: '/requests' },
    { name: 'Jobs', icon: <Briefcase className="h-5 w-5" />, path: '/jobs' },
    { name: 'Quotes', icon: <PenTool className="h-5 w-5" />, path: '/quotes' },
    { name: 'Invoices', icon: <Receipt className="h-5 w-5" />, path: '/invoices' },
    { name: 'Marketing', icon: <BarChart className="h-5 w-5" />, path: '/marketing' },
    { name: 'Insights', icon: <BarChart className="h-5 w-5" />, path: '/insights' },
  ];
  
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 flex items-center">
        <Link to="/" className="flex items-center">
          <img src="/Logo Robusta.png" alt="TaskLoop Logo" className="h-10 w-auto mr-2" />
          <div className="text-4xl font-bold text-gray-900 tracking-tight">TaskLoop</div>
        </Link>
      </div>
      
      <div className="px-3 py-4 relative">
        <Button 
          className="w-full bg-taskloop-gray hover:bg-taskloop-darkgray flex gap-2"
          onClick={() => setIsCreateOpen(!isCreateOpen)}
        >
          <Plus className="h-4 w-4" />
          Create
        </Button>
        <CreateDropdown 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
