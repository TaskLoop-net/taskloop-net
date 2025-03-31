
export interface Job {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: JobStatus;
  type: JobType;
  startDate: Date;
  endDate?: Date;
  scheduledTime?: {
    startTime?: string;
    endTime?: string;
  };
  teamMembers: string[];
  lineItems: LineItem[];
  invoiceOnCompletion: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalPrice: number;
  internalNotes?: string;
}

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type JobType = 'one_off' | 'recurring';

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type NewJob = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>;
