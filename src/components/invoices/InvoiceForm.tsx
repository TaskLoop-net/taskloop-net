
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { InvoiceItem } from '@/types/invoice';
import { Client } from '@/types/client';
import InvoiceHeader from './InvoiceHeader';
import InvoiceDetails from './InvoiceDetails';
import InvoiceItems from './InvoiceItems';
import InvoiceActions from './InvoiceActions';

export const invoiceFormSchema = z.object({
  clientId: z.string().min(1, { message: "Please select a client" }),
  jobId: z.string().optional(),
  subject: z.string().optional(),
  date: z.date({ required_error: "Please select a date" }),
  dueDate: z.date({ required_error: "Please select a due date" }),
  status: z.enum(['draft', 'sent', 'paid', 'past_due']),
  notes: z.string().optional(),
  terms: z.string().optional(),
  billingAddress: z.string().optional(),
  propertyAddress: z.string().optional(),
  balance: z.number().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  defaultValues?: InvoiceFormValues;
  invoiceNumber?: string;
  invoiceId?: string;
  invoiceItems: InvoiceItem[];
  setInvoiceItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  onSubmit: (values: InvoiceFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  clients: Client[];
  selectedClientId: string;
  setSelectedClientId: React.Dispatch<React.SetStateAction<string>>;
  filteredJobs: any[];
  onClientChange: (clientId: string) => void;
  handleJobChange: (jobId: string | undefined) => void;
  getSelectedClient: () => Client | undefined;
  addInvoiceItem: () => void;
  updateInvoiceItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  removeInvoiceItem: (id: string) => void;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  defaultValues,
  invoiceNumber,
  invoiceId,
  invoiceItems,
  onSubmit,
  isSubmitting,
  onCancel,
  clients,
  selectedClientId,
  setSelectedClientId,
  filteredJobs,
  onClientChange,
  handleJobChange,
  getSelectedClient,
  addInvoiceItem,
  updateInvoiceItem,
  removeInvoiceItem,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
}) => {
  const { toast } = useToast();
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultValues || {
      clientId: "",
      date: new Date(),
      dueDate: new Date(),
      status: 'draft'
    }
  });

  const handleFormSubmit = (values: InvoiceFormValues) => {
    if (invoiceItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to the invoice.",
        variant: "destructive",
      });
      return;
    }

    if (invoiceItems.some(item => !item.name)) {
      toast({
        title: "Incomplete items",
        description: "All invoice items must have a name.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <InvoiceHeader 
          form={form} 
          invoiceNumber={invoiceNumber} 
          getSelectedClient={getSelectedClient}
          selectedClientId={selectedClientId}
        />

        <div className="space-y-4">
          <InvoiceDetails 
            form={form} 
            clients={clients} 
            selectedClientId={selectedClientId}
            onClientChange={onClientChange}
            filteredJobs={filteredJobs}
            handleJobChange={handleJobChange}
            getSelectedClient={getSelectedClient}
          />
          
          <InvoiceItems 
            invoiceItems={invoiceItems}
            updateInvoiceItem={updateInvoiceItem}
            removeInvoiceItem={removeInvoiceItem}
            addInvoiceItem={addInvoiceItem}
            calculateSubtotal={calculateSubtotal}
            calculateTax={calculateTax}
            calculateTotal={calculateTotal}
          />
        </div>
        
        <InvoiceActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          invoiceId={invoiceId}
        />
      </form>
    </Form>
  );
};

export default InvoiceForm;
