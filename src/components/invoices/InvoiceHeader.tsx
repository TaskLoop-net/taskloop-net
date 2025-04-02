
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { InvoiceFormValues } from './InvoiceForm';
import { Client } from '@/types/client';

interface InvoiceHeaderProps {
  form: UseFormReturn<InvoiceFormValues>;
  invoiceNumber?: string;
  getSelectedClient: () => Client | undefined;
  selectedClientId: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ 
  form, 
  invoiceNumber,
  getSelectedClient,
  selectedClientId
}) => {
  return (
    <div className="flex items-center mb-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">
          {selectedClientId ? `Invoice for ${getSelectedClient()?.name || ''}` : `Invoice ${invoiceNumber ? `#${invoiceNumber}` : ''}`}
        </h1>
      </div>
      {invoiceNumber && (
        <div className="text-sm text-muted-foreground">
          Invoice #{invoiceNumber}
        </div>
      )}
    </div>
  );
};

export default InvoiceHeader;
