
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

const WeekView = ({ currentDate, events, onDateClick }: WeekViewProps) => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd')
    };
  });

  // Filter events for the current week view
  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getHours() === hour;
    });
  };

  return (
    <div className="bg-white border rounded-lg">
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 font-medium text-gray-500 border-r">Time</div>
        {weekDays.map((day, idx) => (
          <div 
            key={idx} 
            className={`p-4 text-center border-r last:border-r-0 cursor-pointer ${
              format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-50' : ''
            }`}
            onClick={() => onDateClick(day.date)}
          >
            <div className="font-medium">{day.dayName}</div>
            <div className={`text-lg ${
              format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'font-bold text-blue-600' : ''
            }`}>
              {day.dayNumber}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-y-auto max-h-[800px]">
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
            <div className="p-2 text-xs text-gray-500 border-r">
              {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
            </div>
            
            {weekDays.map((day, idx) => {
              const eventsForThisCell = getEventsForDateAndHour(day.date, hour);
              
              return (
                <div 
                  key={idx} 
                  className="p-1 min-h-[60px] border-r last:border-r-0 relative"
                  onClick={() => onDateClick(new Date(day.date.setHours(hour)))}
                >
                  {eventsForThisCell.map((event, eventIdx) => (
                    <div 
                      key={eventIdx} 
                      className="bg-blue-100 border-l-4 border-blue-500 p-1 text-xs rounded mb-1"
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.description && <div className="truncate">{event.description}</div>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
