
export type CalendarEventType = 'job' | 'request' | 'task' | 'event';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: CalendarEventType;
  clientId?: string;
  assignedTo?: string;
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
  status?: string;
  color?: string;
}
