
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  FileText, 
  ClipboardList, 
  Calendar as CalendarIcon, 
  Car, 
  MoreHorizontal, 
  MoveRight,
  UploadCloud,
  CalendarCheck
} from 'lucide-react';

interface MoreActionsMenuProps {
  onCreateJob: () => void;
  onCreateRequest: () => void;
  onCreateTask: () => void;
  onCreateCalendarEvent: () => void;
  onCreateVisit: () => void;
  onMoveVisits: () => void;
  onImportJobs: () => void;
  onSetupCalendarSync: () => void;
}

const MoreActionsMenu = ({
  onCreateJob,
  onCreateRequest,
  onCreateTask,
  onCreateCalendarEvent,
  onCreateVisit,
  onMoveVisits,
  onImportJobs,
  onSetupCalendarSync,
}: MoreActionsMenuProps) => {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          More Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={onCreateJob} className="cursor-pointer">
          <Briefcase className="h-4 w-4 mr-2" />
          Job
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCreateRequest} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Request
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCreateTask} className="cursor-pointer">
          <ClipboardList className="h-4 w-4 mr-2" />
          Task
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCreateCalendarEvent} className="cursor-pointer">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Calendar Event
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCreateVisit} className="cursor-pointer">
          <Car className="h-4 w-4 mr-2" />
          Visits
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onMoveVisits} className="cursor-pointer">
          <MoveRight className="h-4 w-4 mr-2" />
          Move Visits
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImportJobs} className="cursor-pointer">
          <UploadCloud className="h-4 w-4 mr-2" />
          Import Jobs
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSetupCalendarSync} className="cursor-pointer">
          <CalendarCheck className="h-4 w-4 mr-2" />
          Set Up Calendar Sync
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreActionsMenu;
