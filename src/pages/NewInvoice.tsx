
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

import { useInvoices } from '@/contexts/InvoiceContext';
import { useClients } from '@/contexts/ClientContext';
import { useJobs } from '@/contexts/JobContext';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { InvoiceFormValues, invoiceFormSchema } from '@/components/invoices/InvoiceForm';
import InvoiceForm from '@/components/invoices/InvoiceForm';

const NewInvoice = () => {
  const navigate = useNavigate();
  const { addInvoice, getNextInvoiceNumber } = useInvoices();
  const { clients } = useClients();
  const { jobs } = useJobs();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  
  // Use the shared hook for invoice items management
  const {
    invoiceItems,
    setInvoiceItems,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    calculateSubtotal,
    calculateTax,
    calculateTotal
  } = useInvoiceForm();
  
  useEffect(() => {
    // Set the next available invoice number
    setInvoiceNumber(getNextInvoiceNumber());
  }, [getNextInvoiceNumber]);
  
  const filteredJobs = selectedClientId 
    ? jobs.filter(job => job.clientId === selectedClientId)
    : [];

  const onClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    
    // Set billing address if client is selected
    const client = clients.find(c => c.id === clientId);
    if (client && client.address) {
      // We'll handle this in the form component
    }
  };

  const populateItemsFromJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.lineItems) {
      // Convert job line items to invoice items
      const newInvoiceItems = job.lineItems.map(item => ({
        id: crypto.randomUUID(),
        name: item.name,
        description: item.description || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      }));
      setInvoiceItems(newInvoiceItems);
    }
  };

  const handleJobChange = (jobId: string | undefined) => {
    if (jobId) {
      populateItemsFromJob(jobId);
    }
  };

  const getSelectedClient = () => {
    return clients.find(client => client.id === selectedClientId);
  };

  const onSubmit = async (values: InvoiceFormValues) => {
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
    
    setIsSubmitting(true);
    
    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();
      
      const invoice = addInvoice({
        number: invoiceNumber,
        clientId: values.clientId,
        jobId: values.jobId,
        date: values.date,
        dueDate: values.dueDate,
        items: invoiceItems,
        subtotal,
        tax,
        total,
        status: values.status,
        notes: values.notes,
        terms: values.terms,
        subject: values.subject,
        balance: total, // Initially, balance equals total
        billingAddress: values.billingAddress,
        propertyAddress: values.propertyAddress
      });
      
      toast({
        title: "Invoice created",
        description: "Your invoice has been created successfully.",
      });
      
      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "There was an error creating your invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = {
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: 'draft' as const,
    clientId: "",
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {selectedClientId ? `Invoice for ${getSelectedClient()?.name || ''}` : 'Create New Invoice'}
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Invoice #{invoiceNumber} 
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <InvoiceForm
            defaultValues={defaultValues}
            invoiceNumber={invoiceNumber}
            invoiceItems={invoiceItems}
            setInvoiceItems={setInvoiceItems}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => navigate('/invoices')}
            clients={clients}
            selectedClientId={selectedClientId}
            setSelectedClientId={setSelectedClientId}
            filteredJobs={filteredJobs}
            onClientChange={onClientChange}
            handleJobChange={handleJobChange}
            getSelectedClient={getSelectedClient}
            addInvoiceItem={addInvoiceItem}
            updateInvoiceItem={updateInvoiceItem}
            removeInvoiceItem={removeInvoiceItem}
            calculateSubtotal={calculateSubtotal}
            calculateTax={calculateTax}
            calculateTotal={calculateTotal}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewInvoice;
