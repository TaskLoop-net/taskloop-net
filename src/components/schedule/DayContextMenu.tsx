
import React from 'react';
import {
  Briefcase,
  FileText,
  ClipboardList,
  Calendar as CalendarIcon,
  Clock,
  Map
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type DayContextMenuProps = {
  children: React.ReactNode;
  day: number;
  month: string;
  onCreateJob: () => void;
  onCreateRequest: () => void;
  onCreateTask: () => void;
  onCreateCalendarEvent: () => void;
  onShowDayView: () => void;
  onShowMapView: () => void;
}

const DayContextMenu = ({ 
  children, 
  day, 
  month,
  onCreateJob,
  onCreateRequest,
  onCreateTask,
  onCreateCalendarEvent,
  onShowDayView,
  onShowMapView
}: DayContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="h-full w-full">
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold">
          Add to {month} {day}
        </div>
        <ContextMenuItem onClick={onCreateJob} className="flex items-center gap-2 cursor-pointer">
          <Briefcase size={16} className="text-green-600" />
          <span>New Job</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCreateRequest} className="flex items-center gap-2 cursor-pointer">
          <FileText size={16} className="text-amber-600" />
          <span>New Request</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCreateTask} className="flex items-center gap-2 cursor-pointer">
          <ClipboardList size={16} className="text-purple-600" />
          <span>New Task</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCreateCalendarEvent} className="flex items-center gap-2 cursor-pointer">
          <CalendarIcon size={16} className="text-blue-600" />
          <span>New Calendar Event</span>
        </ContextMenuItem>
        <div className="h-px bg-gray-200 my-1.5" />
        <ContextMenuItem onClick={onShowDayView} className="flex items-center gap-2 cursor-pointer">
          <Clock size={16} />
          <span>Show on Day View</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onShowMapView} className="flex items-center gap-2 cursor-pointer">
          <Map size={16} />
          <span>Show on Map View</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DayContextMenu;
