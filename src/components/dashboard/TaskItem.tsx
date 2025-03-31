
import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  title: string;
  description: string;
  time?: string;
  actionLabel?: string;
  onClick?: () => void;
  icon: React.ReactNode;
}

const TaskItem = ({ 
  title, 
  description, 
  time, 
  actionLabel = "View", 
  onClick,
  icon 
}: TaskItemProps) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-gray-100 rounded-full p-2">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          
          {time && (
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{time}</span>
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClick}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
