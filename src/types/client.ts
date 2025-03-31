
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  balance: number;
  properties: number;
  createdAt: Date;
  
  // Extended fields
  companyName?: string;
  useCompanyName?: boolean;
  firstName?: string;
  lastName?: string;
  street1?: string;
  street2?: string;
  country?: string;
}

export interface NewClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  companyName?: string;
  useCompanyName?: boolean;
  firstName?: string;
  lastName?: string;
  street1?: string;
  street2?: string;
  country?: string;
}
