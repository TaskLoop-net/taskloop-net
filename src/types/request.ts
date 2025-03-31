
export interface Request {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: RequestStatus;
  propertyType: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RequestStatus = 'new' | 'assessment_complete' | 'overdue' | 'unscheduled';

export type NewRequest = Omit<Request, 'id' | 'createdAt' | 'updatedAt'>;
