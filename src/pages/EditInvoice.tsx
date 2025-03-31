
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Plus, Trash2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useInvoices } from '@/contexts/InvoiceContext';
import { useClients } from '@/contexts/ClientContext';
import { useJobs } from '@/contexts/JobContext';
import type { Invoice, InvoiceItem } from '@/types/invoice';

const invoiceFormSchema = z.object({
  clientId: z.string().min(1, { message: "Please select a client" }),
  jobId: z.string().optional(),
  date: z.date({ required_error: "Please select a date" }),
  dueDate: z.date({ required_error: "Please select a due date" }),
  status: z.enum(['draft', 'sent', 'paid', 'past_due']),
  subject: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional()
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

const EditInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, updateInvoice } = useInvoices();
  const { clients } = useClients();
  const { jobs } = useJobs();
  const { toast } = useToast();
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

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientId: "",
      date: new Date(),
      dueDate: new Date(),
      status: 'draft'
    },
    values: invoice ? {
      clientId: invoice.clientId,
      jobId: invoice.jobId,
      date: new Date(invoice.date),
      dueDate: new Date(invoice.dueDate),
      status: invoice.status,
      subject: invoice.subject || "",
      notes: invoice.notes || "",
      terms: invoice.terms || ""
    } : undefined
  });

  const filteredJobs = selectedClientId 
    ? jobs.filter(job => job.clientId === selectedClientId)
    : [];

  const onClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    form.setValue('clientId', clientId);
    // Clear job selection when changing client
    form.setValue('jobId', undefined);
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
          
          // Automatically update total when quantity or unitPrice changes
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
    // In a real app, this could be calculated based on a tax rate setting
    return invoice?.tax || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const populateItemsFromJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.lineItems) {
      // Convert job line items to invoice items
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
    if (!invoice) return;
    
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
      
      // If status is changing to paid, set balance to 0
      const newBalance = values.status === 'paid' ? 0 : total;
      
      updateInvoice(invoice.id, {
        ...values,
        items: invoiceItems,
        subtotal,
        tax,
        total,
        balance: newBalance
      });
      
      toast({
        title: "Invoice updated",
        description: "Your invoice has been updated successfully.",
      });
      
      navigate(`/invoices/${invoice.id}`);
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
    form.setValue('jobId', jobId);
    if (jobId) {
      populateItemsFromJob(jobId);
    }
  };

  if (!invoice) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Invoice #{invoice.number}</h1>
          <p className="text-muted-foreground">Update invoice details</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Invoice Information
          </CardTitle>
          <CardDescription>
            Edit the invoice details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select 
                        onValueChange={onClientChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.length === 0 ? (
                            <SelectItem value="none" disabled>No clients available</SelectItem>
                          ) : (
                            clients.map(client => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jobId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Job (Optional)</FormLabel>
                      <Select 
                        onValueChange={handleJobChange} 
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {filteredJobs.length === 0 ? (
                            <SelectItem value="none" disabled>No jobs for this client</SelectItem>
                          ) : (
                            filteredJobs.map(job => (
                              <SelectItem key={job.id} value={job.id}>
                                {job.title}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="past_due">Past Due</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Monthly Landscaping Services" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>
                      A brief description that will appear on the invoice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button type="button" onClick={addInvoiceItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {invoiceItems.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No items added yet. Click "Add Item" to add an item.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoiceItems.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-start border rounded-md p-3">
                        <div className="col-span-12 md:col-span-5">
                          <FormLabel className="text-xs">Name</FormLabel>
                          <Input
                            value={item.name}
                            onChange={(e) => updateInvoiceItem(item.id, 'name', e.target.value)}
                            placeholder="Item name"
                          />
                          <div className="mt-2">
                            <FormLabel className="text-xs">Description (Optional)</FormLabel>
                            <Input
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                              placeholder="Description"
                            />
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <FormLabel className="text-xs">Quantity</FormLabel>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                            min="1"
                            step="1"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <FormLabel className="text-xs">Unit Price ($)</FormLabel>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', Number(e.target.value))}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <FormLabel className="text-xs">Total</FormLabel>
                          <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm flex items-center">
                            ${item.total.toFixed(2)}
                          </div>
                        </div>
                        <div className="col-span-1 pt-7">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeInvoiceItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end mt-4">
                      <div className="w-48">
                        <div className="flex justify-between px-4 py-2">
                          <span>Subtotal:</span>
                          <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between px-4 py-2">
                          <span>Tax:</span>
                          <span>${calculateTax().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between px-4 py-2 font-medium border-t">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any notes for this invoice" 
                          className="min-h-24" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        These notes will be displayed on the invoice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add terms and conditions" 
                          className="min-h-24" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Payment terms and conditions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/invoices/${invoice.id}`)} 
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditInvoice;
