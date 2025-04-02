
import React from 'react';
import { Calendar, Clock, Map, List, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const ViewSelector = ({ currentView, onViewChange }: ViewSelectorProps) => {
  const views = [
    { id: 'month', name: 'Month', icon: <Calendar className="h-4 w-4" /> },
    { id: 'week', name: 'Week', icon: <Clock className="h-4 w-4" /> },
    { id: 'day', name: 'Day', icon: <Clock className="h-4 w-4" /> },
    { id: 'map', name: 'Map', icon: <Map className="h-4 w-4" /> },
    { id: 'list', name: 'List', icon: <List className="h-4 w-4" /> },
  ];

  const currentViewData = views.find(v => v.id === currentView) || views[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-white">
          {currentViewData.icon}
          {currentViewData.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {views.map(view => (
          <DropdownMenuItem 
            key={view.id} 
            onClick={() => onViewChange(view.id)}
            className={`flex items-center gap-2 cursor-pointer ${currentView === view.id ? 'bg-gray-100' : ''}`}
          >
            {view.icon}
            {view.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewSelector;
