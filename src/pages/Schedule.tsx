
import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Schedule = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    return days;
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const formatMonth = () => {
    return currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Example appointments
  const appointments = [
    { id: 1, day: 13, client: 'Neena Tikoo', title: 'Quote Reminder', time: '10:00 AM' },
  ];
  
  const calendarDays = generateCalendarDays();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-taskloop-darkblue">Schedule</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Today</Button>
          <div className="flex items-center border rounded-md bg-white">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="px-4">{formatMonth()}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="outline">Month</Button>
          <Button className="bg-taskloop-blue hover:bg-taskloop-darkblue">Filters</Button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {daysOfWeek.map(day => (
            <div key={day} className="px-4 py-3 text-center font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-6 h-[800px]">
          {calendarDays.map((day, index) => {
            const hasAppointment = appointments.some(apt => apt.day === day.day);
            
            return (
              <div 
                key={index} 
                className={`border-t border-r min-h-[120px] p-2 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : ''
                }`}
              >
                {day.day && (
                  <>
                    <div className="font-medium">{day.day}</div>
                    {hasAppointment && (
                      <div className="mt-2">
                        {appointments
                          .filter(apt => apt.day === day.day)
                          .map(apt => (
                            <div 
                              key={apt.id} 
                              className="bg-red-100 border-l-4 border-red-500 p-2 rounded text-sm mb-1"
                            >
                              <div className="font-medium">{apt.title}</div>
                              <div className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {apt.time}
                              </div>
                              <div className="text-xs">{apt.client}</div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Unscheduled</h2>
          <p className="text-gray-500 text-sm">Drag items here to unschedule them</p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
