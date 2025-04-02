
import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  teamMembers: string[];
  onTimeSlotClick: (time: Date, teamMember?: string) => void;
}

const DayView = ({ currentDate, events, teamMembers, onTimeSlotClick }: DayViewProps) => {
  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7am to 10pm
  
  // Get events for a specific hour and team member
  const getEventsForHourAndTeamMember = (hour: number, teamMember?: string) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === currentDate.getDate() && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear() &&
             eventDate.getHours() === hour &&
             (!teamMember || event.assignedTo === teamMember);
    });
  };

  return (
    <div className="bg-white border rounded-lg">
      <div className="grid" style={{ gridTemplateColumns: `100px repeat(${teamMembers.length}, 1fr)` }}>
        {/* Header row */}
        <div className="p-3 font-medium border-b border-r bg-gray-50 text-center">
          <div>ANY TIME</div>
        </div>
        
        {teamMembers.map((member, idx) => (
          <div key={idx} className="p-3 font-medium border-b border-r last:border-r-0 bg-gray-50">
            {member}
          </div>
        ))}
        
        {/* Time slots */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="p-2 text-xs text-gray-500 border-b border-r text-center">
              {hour} {hour < 12 ? 'AM' : 'PM'}
            </div>
            
            {teamMembers.map((member, idx) => {
              const eventsForCell = getEventsForHourAndTeamMember(hour, member);
              
              return (
                <div 
                  key={`${member}-${hour}`} 
                  className="border-b border-r last:border-r-0 min-h-[60px] cursor-pointer hover:bg-gray-50"
                  onClick={() => onTimeSlotClick(new Date(currentDate.setHours(hour)), member)}
                >
                  {eventsForCell.map((event, eventIdx) => (
                    <div 
                      key={eventIdx}
                      className="bg-blue-100 m-1 p-2 text-xs rounded"
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.description && <div className="truncate">{event.description}</div>}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DayView;
