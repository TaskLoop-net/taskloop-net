
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ClipboardList, Users, Bell, Calendar as CalendarIcon, FileText, Car, Sun } from 'lucide-react';

interface FilterMenuProps {
  onApplyFilters: (filters: {
    types: string[],
    status: string[],
    showWeekends: boolean
  }) => void;
}

const FilterMenu = ({ onApplyFilters }: FilterMenuProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showWeekends, setShowWeekends] = useState<boolean>(true);

  const types = [
    { id: 'tasks', name: 'Tasks', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'visits', name: 'Visits', icon: <Car className="h-4 w-4" /> },
    { id: 'reminders', name: 'Reminders', icon: <Bell className="h-4 w-4" /> },
    { id: 'events', name: 'Events', icon: <CalendarIcon className="h-4 w-4" /> },
    { id: 'requests', name: 'Requests', icon: <FileText className="h-4 w-4" /> },
    { id: 'dailyVisitCounts', name: 'Daily Visit Counts', icon: <Car className="h-4 w-4" /> },
  ];

  const statuses = [
    { id: 'unassigned', name: 'Unassigned' },
  ];

  const toggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(id => id !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const toggleStatus = (statusId: string) => {
    if (selectedStatuses.includes(statusId)) {
      setSelectedStatuses(selectedStatuses.filter(id => id !== statusId));
    } else {
      setSelectedStatuses([...selectedStatuses, statusId]);
    }
  };

  const toggleWeekends = () => {
    setShowWeekends(!showWeekends);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setShowWeekends(true);
    onApplyFilters({
      types: [],
      status: [],
      showWeekends: true
    });
  };

  const applyFilters = () => {
    onApplyFilters({
      types: selectedTypes,
      status: selectedStatuses,
      showWeekends
    });
  };

  const isFiltersActive = selectedTypes.length > 0 || selectedStatuses.length > 0 || !showWeekends;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${isFiltersActive ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}`}>
          Filters
          {isFiltersActive && <span className="bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs">On</span>}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Filters</h3>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
        
        <DropdownMenuLabel className="font-semibold text-sm text-gray-700 py-2 uppercase">Types</DropdownMenuLabel>
        {types.map((type) => (
          <div 
            key={type.id}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
            onClick={() => toggleType(type.id)}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {selectedTypes.includes(type.id) ? <Check className="w-4 h-4" /> : null}
            </div>
            {type.icon}
            <span>{type.name}</span>
          </div>
        ))}
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuLabel className="font-semibold text-sm text-gray-700 py-2 uppercase">Status</DropdownMenuLabel>
        {statuses.map((status) => (
          <div 
            key={status.id}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
            onClick={() => toggleStatus(status.id)}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {selectedStatuses.includes(status.id) ? <Check className="w-4 h-4" /> : null}
            </div>
            <span>{status.name}</span>
          </div>
        ))}
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuLabel className="font-semibold text-sm text-gray-700 py-2 uppercase">Days</DropdownMenuLabel>
        <div 
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
          onClick={toggleWeekends}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {showWeekends ? <Check className="w-4 h-4" /> : null}
          </div>
          <Sun className="h-4 w-4" />
          <span>Show/Hide Weekends</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
