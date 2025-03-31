
import React from 'react';
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
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: 'Schedule', icon: <Calendar className="h-5 w-5" />, path: '/schedule' },
    { name: 'Clients', icon: <Users className="h-5 w-5" />, path: '/clients' },
    { name: 'Requests', icon: <FileText className="h-5 w-5" />, path: '/requests' },
    { name: 'Jobs', icon: <Briefcase className="h-5 w-5" />, path: '/jobs' },
    { name: 'Quotes', icon: <PenTool className="h-5 w-5" />, path: '/quotes' },
    { name: 'Invoices', icon: <DollarSign className="h-5 w-5" />, path: '/invoices' },
    { name: 'Marketing', icon: <BarChart className="h-5 w-5" />, path: '/marketing' },
    { name: 'Insights', icon: <BarChart className="h-5 w-5" />, path: '/insights' },
  ];
  
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 flex items-center">
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold text-taskloop-gray">Task<span className="text-taskloop-darkgray">Loop</span></div>
        </Link>
      </div>
      
      <div className="px-3 py-4">
        <Button className="w-full bg-taskloop-gray hover:bg-taskloop-darkgray flex gap-2">
          <Plus className="h-4 w-4" />
          Create
        </Button>
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
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-taskloop-gray flex items-center justify-center text-white font-medium">
            TL
          </div>
          <div>
            <p className="text-sm font-medium">Task Loop</p>
            <p className="text-xs text-gray-500">Los Angeles, CA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
