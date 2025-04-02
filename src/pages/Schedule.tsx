
import React, { useState } from 'react';
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

const Schedule = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
  const [dayContextMenuOpen, setDayContextMenuOpen] = useState(false);
  
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Example appointments
  const appointments = [
    { id: 1, day: 13, client: 'Neena Tikoo', title: 'Quote Reminder', time: '10:00 AM' },
  ];

  const user = {
    name: 'Andre Amador',
    email: 'extremesolutionspainting@gmail.com',
    initials: 'AA'
  };
  
  const getDaysInMonth = (year: number, month: number) => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    return eachDayOfInterval({ start, end });
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return getDay(new Date(year, month, 1));
  };
  
  // Generate calendar days
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
    
    // Add days from previous month
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
    
    // Add days of current month
    daysInMonth.forEach(day => {
      days.push({ 
        date: day, 
        day: day.getDate(), 
        isCurrentMonth: true, 
        isPrevMonth: false, 
        isNextMonth: false 
      });
    });
    
    // Add days from next month
    const totalDaysShown = 42; // 6 rows of 7 days
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

    // Redirect to appropriate creation page based on type
    switch(type) {
      case 'job':
        navigate('/jobs/new');
        break;
      case 'request':
        navigate('/requests/new');
        break;
      case 'task':
        // Navigate to task creation or show task creation modal
        break;
      case 'event':
        // Navigate to event creation or show event creation modal
        break;
    }
  };
  
  const calendarDays = generateCalendarDays();

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
            user={user}
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
          <div className="flex items-center border rounded-md bg-white">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="px-4 font-medium">
                  {formatMonth()}
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
                const hasAppointment = appointments.some(apt => apt.day === day.day && day.isCurrentMonth);
                const isWeekend = index % 7 === 0 || index % 7 === 6;
                
                // Hide weekends if the filter is applied
                if (!filters.showWeekends && isWeekend) {
                  return null;
                }
                
                return (
                  <DayContextMenu
                    key={index} 
                    day={day.day}
                    month={format(day.date, 'MMMM')}
                    onCreateJob={() => handleCreateNewEntity('job')}
                    onCreateRequest={() => handleCreateNewEntity('request')}
                    onCreateTask={() => handleCreateNewEntity('task')}
                    onCreateCalendarEvent={() => handleCreateNewEntity('event')}
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
                      {hasAppointment && day.isCurrentMonth && (
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
                    </div>
                  </DayContextMenu>
                );
              })}
            </div>
          </>
        )}
        
        {currentView === 'day' && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : format(new Date(), 'EEEE, MMMM d, yyyy')}
            </h2>
            <div className="space-y-4">
              {/* Day view content would go here */}
              <div className="text-center py-8 text-gray-500">
                Day view implementation coming soon
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'week' && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Week View</h2>
            <div className="space-y-4">
              {/* Week view content would go here */}
              <div className="text-center py-8 text-gray-500">
                Week view implementation coming soon
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'map' && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Map View</h2>
            <div className="space-y-4">
              {/* Map view content would go here */}
              <div className="text-center py-8 text-gray-500">
                Map view implementation coming soon
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'list' && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">List View</h2>
            <div className="space-y-4">
              {/* List view content would go here */}
              <div className="text-center py-8 text-gray-500">
                List view implementation coming soon
              </div>
            </div>
          </div>
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
      
      {/* Dialog for day click */}
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
              <Briefcase className="h-5 w-5 mr-3" />
              New Job
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base font-normal"
              onClick={() => handleCreateNewEntity('request')}
            >
              <FileText className="h-5 w-5 mr-3" />
              New Request
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base font-normal"
              onClick={() => handleCreateNewEntity('task')}
            >
              <ClipboardList className="h-5 w-5 mr-3" />
              New Task
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base font-normal"
              onClick={() => handleCreateNewEntity('event')}
            >
              <CalendarDays className="h-5 w-5 mr-3" />
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
                <Calendar className="h-5 w-5 mr-3" />
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
