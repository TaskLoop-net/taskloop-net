
export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'changes_requested';
  createdAt: Date;
  validUntil: Date;
  notes?: string;
}

export interface NewQuote {
  clientId: string;
  title: string;
  description?: string;
  items: Omit<QuoteItem, 'id'>[];
  tax?: number;
  validUntil?: Date;
  notes?: string;
}
