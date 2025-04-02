
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

import { useInvoices } from '@/contexts/InvoiceContext';
import { useClients } from '@/contexts/ClientContext';
import { useJobs } from '@/contexts/JobContext';
import { useInvoiceValidation } from '@/hooks/useInvoiceValidation';
import type { Invoice, InvoiceItem } from '@/types/invoice';

import InvoiceForm, { InvoiceFormValues } from '@/components/invoices/InvoiceForm';

const EditInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, updateInvoice } = useInvoices();
  const { clients } = useClients();
  const { jobs } = useJobs();
  const { toast } = useToast();
  const { validateInvoice } = useInvoiceValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (id) {
      const invoiceData = getInvoiceById(id);
      if (invoiceData) {
        setInvoice(invoiceData);
        setInvoiceItems(invoiceData.items || []);
        setSelectedClientId(invoiceData.clientId);
      } else {
        toast({
          title: "Invoice not found",
          description: "The invoice you are trying to edit doesn't exist.",
          variant: "destructive",
        });
        navigate('/invoices');
      }
    }
  }, [id, getInvoiceById, navigate, toast]);

  const filteredJobs = selectedClientId 
    ? jobs.filter(job => job.clientId === selectedClientId)
    : [];

  const onClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    
    const client = clients.find(c => c.id === clientId);
    if (client && client.address) {
      // We'll update these values in the form
      if (invoice) {
        const updatedInvoice = { ...invoice };
        if (!updatedInvoice.billingAddress) {
          updatedInvoice.billingAddress = client.address;
        }
        if (!updatedInvoice.propertyAddress) {
          updatedInvoice.propertyAddress = client.address;
        }
        setInvoice(updatedInvoice);
      }
    }
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return invoice?.tax || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const populateItemsFromJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.lineItems) {
      const newInvoiceItems: InvoiceItem[] = job.lineItems.map(item => ({
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

  const onSubmit = async (values: InvoiceFormValues) => {
    if (!invoice || !id) return;
    
    // Use the validation hook to validate invoice items
    if (!validateInvoice(invoiceItems)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();
      
      if (values.status === 'paid') {
        values.balance = 0;
      } else {
        values.balance = total;
      }
      
      updateInvoice(id, {
        ...values,
        items: invoiceItems,
        subtotal,
        tax,
        total,
        balance: values.balance
      });
      
      toast({
        title: "Invoice updated",
        description: "Your invoice has been updated successfully.",
      });
      
      navigate(`/invoices/${id}`);
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        title: "Error",
        description: "There was an error updating your invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  if (!invoice) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const formDefaultValues = {
    clientId: invoice.clientId,
    jobId: invoice.jobId,
    date: new Date(invoice.date),
    dueDate: new Date(invoice.dueDate),
    status: invoice.status,
    subject: invoice.subject || "",
    notes: invoice.notes || "",
    terms: invoice.terms || "",
    billingAddress: invoice.billingAddress || "",
    propertyAddress: invoice.propertyAddress || ""
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <InvoiceForm
            defaultValues={formDefaultValues}
            invoiceNumber={invoice.number}
            invoiceId={id}
            invoiceItems={invoiceItems}
            setInvoiceItems={setInvoiceItems}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => navigate(`/invoices/${id}`)}
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

export default EditInvoice;
