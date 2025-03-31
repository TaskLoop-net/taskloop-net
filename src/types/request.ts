
export interface Request {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: RequestStatus;
  propertyType: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Extended fields from design
  requestedOn?: Date;
  preferredDate?: Date;
  alternateDate?: Date;
  preferredTimes?: string[];
  requiresOnSiteAssessment?: boolean;
  internalNotes?: string;
  attachments?: string[];
  linkedQuotes?: boolean;
  linkedJobs?: boolean;
  linkedInvoices?: boolean;
}

export type RequestStatus = 'new' | 'assessment_complete' | 'overdue' | 'unscheduled';

export type NewRequest = Omit<Request, 'id' | 'createdAt' | 'updatedAt'>;
