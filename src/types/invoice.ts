
export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  jobId?: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
  subject?: string;
  balance: number;
  billingAddress?: string;
  propertyAddress?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  serviceDate?: Date;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'past_due';

export type NewInvoice = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
