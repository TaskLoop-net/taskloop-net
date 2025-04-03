import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  FileText, 
  ClipboardList, 
  CalendarDays, 
  Car, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import DayContextMenu from '@/components/schedule/DayContextMenu';
import ViewSelector from '@/components/schedule/ViewSelector';
import FilterMenu from '@/components/schedule/FilterMenu';
import MoreActionsMenu from '@/components/schedule/MoreActionsMenu';
import HelpMenu from '@/components/schedule/HelpMenu';
import UserProfileMenu from '@/components/schedule/UserProfileMenu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import { useJobs } from '@/contexts/JobContext';
import { useRequests } from '@/contexts/RequestContext';
import ListView from '@/components/schedule/views/ListView';
import WeekView from '@/components/schedule/views/WeekView';
import DayView from '@/components/schedule/views/DayView';
import MapView from '@/components/schedule/views/MapView';
import { CalendarEvent } from '@/types/calendar';

const Schedule = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { requests } = useRequests();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentView, setCurrentView] = useState('month');
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    status: [] as string[],
    showWeekends: true
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const jobEvents: CalendarEvent[] = jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      startDate: new Date(job.startDate),
      endDate: job.endDate ? new Date(job.endDate) : undefined,
      type: 'job',
      clientId: job.clientId,
      status: job.status,
      color: 'blue'
    }));

    const requestEvents: CalendarEvent[] = requests.map(request => ({
      id: request.id,
      title: request.title,
      description: request.description,
      startDate: new Date(request.createdAt),
      type: 'request',
      clientId: request.clientId,
      status: request.status,
      color: 'amber'
    }));

    const appointments: CalendarEvent[] = [
      { 
        id: '1', 
        title: 'Quote Reminder', 
        description: 'Neena Tikoo', 
        startDate: new Date(new Date().setDate(13)), 
        type: 'event',
        color: 'red'
      },
    ];

    setCalendarEvents([...jobEvents, ...requestEvents, ...appointments]);
  }, [jobs, requests]);
  
  const getDaysInMonth = (year: number, month: number) => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    return eachDayOfInterval({ start, end });
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return getDay(new Date(year, month, 1));
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const prevMonth = subMonths(currentMonth, 1);
    const prevMonthDays = getDaysInMonth(
      prevMonth.getFullYear(),
      prevMonth.getMonth()
    );
    
    const nextMonth = addMonths(currentMonth, 1);
    
    const days = [];
    
    const prevMonthDaysToShow = firstDayOfMonth;
    for (let i = prevMonthDaysToShow - 1; i >= 0; i--) {
      const day = prevMonthDays[prevMonthDays.length - 1 - i];
      days.push({ 
        date: day, 
        day: day.getDate(), 
        isCurrentMonth: false, 
        isPrevMonth: true 
      });
    }
    
    daysInMonth.forEach(day => {
      days.push({ 
        date: day, 
        day: day.getDate(), 
        isCurrentMonth: true, 
        isPrevMonth: false, 
        isNextMonth: false 
      });
    });
    
    const totalDaysShown = 42;
    const nextMonthDaysToShow = totalDaysShown - days.length;
    for (let i = 0; i < nextMonthDaysToShow; i++) {
      const day = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1);
      days.push({ 
        date: day, 
        day: day.getDate(), 
        isCurrentMonth: false, 
        isPrevMonth: false, 
        isNextMonth: true 
      });
    }
    
    return days;
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };
  
  const formatMonth = () => {
    return format(currentMonth, 'MMMM yyyy');
  };
  
  const handleDayClick = (day: number, date: Date) => {
    setSelectedDay(day);
    setSelectedDate(date);
    setDayDialogOpen(true);
  };

  const handleCreateNewEntity = (type: string) => {
    setDayDialogOpen(false);
    
    toast({
      title: "Create new " + type,
      description: selectedDate ? `For date: ${format(selectedDate, 'MMMM d, yyyy')}` : '',
    });

    switch(type) {
      case 'job':
        navigate('/jobs/new');
        break;
      case 'request':
        navigate('/requests/new');
        break;
      case 'task':
        break;
      case 'event':
        break;
    }
  };

  const handleTimeSlotClick = (date: Date, teamMember?: string) => {
    setSelectedDate(date);
    setDayDialogOpen(true);
  };
  
  const calendarDays = generateCalendarDays();

  const listViewItems = calendarEvents.map(event => ({
    id: event.id,
    title: event.title,
    type: event.type,
    clientName: event.description,
    date: event.startDate,
    description: '',
    assignedTo: event.assignedTo || 'Andre Amador'
  }));

  const teamMembers = ['Andre Amador'];

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-taskloop-darkblue">Schedule</h1>
        <div className="flex items-center space-x-2">
          <HelpMenu 
            onHelp={() => window.open('/help', '_blank')}
            onVideos={() => window.open('/videos', '_blank')}
            onTerms={() => window.open('/terms', '_blank')}
          />
          <UserProfileMenu 
            user={{
              name: 'Andre Amador',
              email: 'extremesolutionspainting@gmail.com',
              initials: 'AA'
            }}
            onSettings={() => toast({ title: "Settings clicked" })}
            onBilling={() => toast({ title: "Billing clicked" })}
            onTeam={() => toast({ title: "Team management clicked" })}
            onDarkMode={() => setIsDarkMode(!isDarkMode)}
            onLogout={() => toast({ title: "Logout clicked" })}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={goToToday}>Today</Button>
          
          {currentView !== 'list' && (
            <div className="flex items-center border rounded-md bg-white">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-4 font-medium">
                    {currentView === 'week' ? 
                      `${format(currentMonth, 'MMM d')} - ${format(addMonths(currentMonth, 0), 'MMM d')}` : 
                      currentView === 'day' ? 
                        format(selectedDate || currentMonth, 'EEE, MMM d, yyyy') :
                        formatMonth()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-2">
                    <h3 className="font-medium mb-2">Jump to month</h3>
                    <div className="grid grid-cols-3 gap-1">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                        <Button 
                          key={month} 
                          variant="ghost" 
                          size="sm" 
                          className="h-9"
                          onClick={() => {
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(i);
                            setCurrentMonth(newDate);
                          }}
                        >
                          {month}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <ViewSelector
            currentView={currentView}
            onViewChange={(view) => setCurrentView(view)}
          />
          <FilterMenu
            onApplyFilters={setFilters}
          />
          <MoreActionsMenu
            onCreateJob={() => handleCreateNewEntity('job')}
            onCreateRequest={() => handleCreateNewEntity('request')}
            onCreateTask={() => handleCreateNewEntity('task')}
            onCreateCalendarEvent={() => handleCreateNewEntity('event')}
            onCreateVisit={() => toast({ title: "Create Visit clicked" })}
            onMoveVisits={() => toast({ title: "Move Visits clicked" })}
            onImportJobs={() => toast({ title: "Import Jobs clicked" })}
            onSetupCalendarSync={() => toast({ title: "Calendar Sync clicked" })}
          />
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {currentView === 'month' && (
          <>
            <div className="grid grid-cols-7 border-b">
              {daysOfWeek.map(day => (
                <div key={day} className="px-4 py-3 text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 grid-rows-6 h-[800px]">
              {calendarDays.map((day, index) => {
                const eventsForDay = calendarEvents.filter(event => {
                  const eventDate = new Date(event.startDate);
                  return eventDate.getDate() === day.day && 
                         eventDate.getMonth() === day.date.getMonth() && 
                         eventDate.getFullYear() === day.date.getFullYear();
                });
                
                const isWeekend = index % 7 === 0 || index % 7 === 6;
                
                if (!filters.showWeekends && isWeekend) {
                  return null;
                }
                
                return (
                  <DayContextMenu
                    key={index} 
                    day={day.day}
                    month={format(day.date, 'MMMM')}
                    onCreateJob={() => {
                      setSelectedDate(day.date);
                      handleCreateNewEntity('job');
                    }}
                    onCreateRequest={() => {
                      setSelectedDate(day.date);
                      handleCreateNewEntity('request');
                    }}
                    onCreateTask={() => {
                      setSelectedDate(day.date);
                      handleCreateNewEntity('task');
                    }}
                    onCreateCalendarEvent={() => {
                      setSelectedDate(day.date);
                      handleCreateNewEntity('event');
                    }}
                    onShowDayView={() => {
                      setCurrentView('day');
                      setSelectedDate(day.date);
                    }}
                    onShowMapView={() => {
                      setCurrentView('map');
                      setSelectedDate(day.date);
                    }}
                  >
                    <div 
                      className={`border-t border-r min-h-[120px] p-2 ${
                        !day.isCurrentMonth ? 'bg-gray-50' : ''
                      } ${day.isPrevMonth || day.isNextMonth ? 'text-gray-400' : ''} 
                      ${day.isCurrentMonth && isWeekend ? 'bg-gray-50' : ''}
                      cursor-pointer hover:bg-gray-100`}
                      onClick={() => handleDayClick(day.day, day.date)}
                    >
                      <div className="font-medium">{day.day}</div>
                      
                      {eventsForDay.length > 0 && day.isCurrentMonth && (
                        <div className="mt-2">
                          {eventsForDay.slice(0, 3).map(event => (
                            <div 
                              key={event.id} 
                              className={`
                                ${event.type === 'job' ? 'bg-blue-100 border-blue-500' : 
                                  event.type === 'request' ? 'bg-amber-100 border-amber-500' : 
                                  event.type === 'task' ? 'bg-purple-100 border-purple-500' : 
                                  'bg-red-100 border-red-500'} 
                                border-l-4 p-2 rounded text-sm mb-1
                              `}
                            >
                              <div className="font-medium">{event.title}</div>
                              {event.description && (
                                <div className="text-xs">{event.description}</div>
                              )}
                              <div className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(event.startDate, 'h:mm a')}
                              </div>
                            </div>
                          ))}
                          
                          {eventsForDay.length > 3 && (
                            <div className="text-xs text-blue-500 mt-1">
                              +{eventsForDay.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </DayContextMenu>
                );
              })}
            </div>
          </>
        )}
        
        {currentView === 'week' && (
          <WeekView 
            currentDate={selectedDate || currentMonth}
            events={calendarEvents}
            onDateClick={(date) => {
              setSelectedDate(date);
              handleTimeSlotClick(date);
            }}
          />
        )}
        
        {currentView === 'day' && (
          <DayView 
            currentDate={selectedDate || currentMonth}
            events={calendarEvents}
            teamMembers={teamMembers}
            onTimeSlotClick={handleTimeSlotClick}
          />
        )}
        
        {currentView === 'map' && (
          <MapView 
            currentDate={selectedDate || currentMonth}
            events={calendarEvents}
          />
        )}
        
        {currentView === 'list' && (
          <ListView items={listViewItems} />
        )}
      </div>
      
      <div className="mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <ChevronRight className="h-5 w-5 mr-2" />
            <h2 className="font-semibold">Unscheduled</h2>
          </div>
          <p className="text-gray-500 text-sm mt-2">Drag items here to unschedule them</p>
        </div>
      </div>
      
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add to {selectedDate ? format(selectedDate, 'MMMM d') : ''}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 py-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base font-normal"
              onClick={() => handleCreateNewEntity('job')}
            >
              <Briefcase className="h-5 w-5 mr-3 text-green-600" />
              New Job
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base font-normal"
              onClick={() => handleCreateNewEntity('request')}
            >
              <FileText className="h-5 w-5 mr-3 text-amber-600" />
              New Request
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base font-normal"
              onClick={() => handleCreateNewEntity('task')}
            >
              <ClipboardList className="h-5 w-5 mr-3 text-purple-600" />
              New Task
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base font-normal"
              onClick={() => handleCreateNewEntity('event')}
            >
              <CalendarDays className="h-5 w-5 mr-3 text-blue-600" />
              New Calendar Event
            </Button>
            
            <div className="pt-2 border-t border-gray-100">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-base font-normal"
                onClick={() => {
                  setDayDialogOpen(false);
                  setCurrentView('day');
                }}
              >
                <Clock className="h-5 w-5 mr-3" />
                Show on Day View
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-base font-normal"
                onClick={() => {
                  setDayDialogOpen(false);
                  setCurrentView('map');
                }}
              >
                <Map className="h-5 w-5 mr-3" />
                Show on Map View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
