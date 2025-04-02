
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HelpCircle, Video, FileText } from 'lucide-react';

interface HelpMenuProps {
  onHelp: () => void;
  onVideos: () => void;
  onTerms: () => void;
}

const HelpMenu = ({
  onHelp,
  onVideos,
  onTerms,
}: HelpMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onHelp} className="cursor-pointer">
          <span>Help Center</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onVideos} className="cursor-pointer">
          <Video className="h-4 w-4 mr-2" />
          <span>Videos</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onTerms} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          <span>Terms of Service</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpMenu;
