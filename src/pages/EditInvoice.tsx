import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
  subject: z.string().optional(),
  date: z.date({ required_error: "Please select a date" }),
  dueDate: z.date({ required_error: "Please select a due date" }),
  status: z.enum(['draft', 'sent', 'paid', 'past_due']),
  notes: z.string().optional(),
  terms: z.string().optional(),
  billingAddress: z.string().optional(),
  propertyAddress: z.string().optional(),
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
      terms: invoice.terms || "",
      billingAddress: invoice.billingAddress || "",
      propertyAddress: invoice.propertyAddress || ""
    } : undefined
  });

  const filteredJobs = selectedClientId 
    ? jobs.filter(job => job.clientId === selectedClientId)
    : [];

  const onClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    form.setValue('clientId', clientId);
    
    const client = clients.find(c => c.id === clientId);
    if (client && client.address && !form.getValues().billingAddress) {
      form.setValue('billingAddress', client.address);
      if (!form.getValues().propertyAddress) {
        form.setValue('propertyAddress', client.address);
      }
    }
    
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
      
      if (values.status === 'paid') {
        values.balance = 0;
      } else {
        values.balance = total;
      }
      
      updateInvoice(invoice.id, {
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

  const getSelectedClient = () => {
    return clients.find(client => client.id === selectedClientId);
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {selectedClientId ? `Invoice for ${getSelectedClient()?.name || ''}` : `Edit Invoice #${invoice.number}`}
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Invoice #{invoice.number}
          <Button variant="link" className="p-0 h-auto text-sm ml-1">
            Change
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-medium mb-2">Invoice subject</h2>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="For Services Rendered" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-base font-medium">Billing address</h2>
                    
                    <FormField
                      control={form.control}
                      name="billingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Client billing address" 
                              className="min-h-[100px]" 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-base font-medium">Property Address</h2>
                    <FormField
                      control={form.control}
                      name="propertyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="(Same as billing address)" 
                              className="min-h-[100px]" 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-base font-medium">Contact details</h2>
                    
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
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
                    
                    {selectedClientId && getSelectedClient() && (
                      <div className="text-sm text-muted-foreground">
                        <div>+1{getSelectedClient()?.phone}</div>
                        <div>{getSelectedClient()?.email}</div>
                      </div>
                    )}
                    
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
                              <SelectItem value="none">None</SelectItem>
                              {filteredJobs.length === 0 ? (
                                <SelectItem value="no-jobs" disabled>No jobs for this client</SelectItem>
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-4 mt-4">
                  <div>
                    <h2 className="text-base font-medium mb-4">Invoice details</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Issued date</div>
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
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
                                        format(field.value, "MMM dd, yyyy")
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
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Payment due</div>
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
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
                                        `Net ${Math.round((field.value.getTime() - form.getValues().date.getTime()) / (1000 * 60 * 60 * 24))}`
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
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-base font-medium mb-2">Custom fields</h2>
                    <div className="border rounded-md p-4 text-sm text-muted-foreground">
                      <p>let you track additional details on your invoice, like tax exemptions or preferred billing.</p>
                      <Button variant="outline" className="mt-2">Upgrade Now</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Product / Service</h2>
                  <div className="flex gap-2">
                    <Button type="button" onClick={() => {}} variant="outline" size="sm" className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Client view
                      <Button variant="link" className="p-0 h-auto text-xs ml-1">Change</Button>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5 text-sm font-medium pl-2">Item</div>
                    <div className="col-span-2 text-sm font-medium text-center">Qty.</div>
                    <div className="col-span-2 text-sm font-medium text-right pr-4">Unit Price</div>
                    <div className="col-span-3 text-sm font-medium text-right pr-2">Total</div>
                  </div>
                  
                  {invoiceItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start border rounded-md p-3">
                      <div className="col-span-5">
                        <Input
                          value={item.name}
                          onChange={(e) => updateInvoiceItem(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                          className="mb-2"
                        />
                        <Textarea
                          value={item.description || ''}
                          onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="min-h-[60px] text-sm"
                        />
                        <div className="mt-2 flex justify-end">
                          <Button 
                            type="button" 
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0 text-xs"
                            onClick={() => {
                              const now = new Date();
                              updateInvoiceItem(item.id, 'serviceDate', now);
                            }}
                          >
                            Set Service Date
                          </Button>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                          min="1"
                          step="1"
                          className="text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <span className="mr-1">$</span>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', Number(e.target.value))}
                            min="0"
                            step="0.01"
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="col-span-2 pt-2 text-right pr-2">
                        ${item.total.toFixed(2)}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeInvoiceItem(item.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button type="button" onClick={addInvoiceItem} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line Item
                  </Button>
                  
                  <div className="flex justify-end mt-4">
                    <div className="w-64">
                      <div className="flex justify-between px-4 py-2">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2">
                        <span>Discount:</span>
                        <Button variant="link" className="h-auto p-0 text-sm">
                          Add Discount
                        </Button>
                      </div>
                      <div className="flex justify-between px-4 py-2">
                        <span>Tax:</span>
                        <Button variant="link" className="h-auto p-0 text-sm">
                          Add Tax
                        </Button>
                      </div>
                      <div className="flex justify-between px-4 py-2 font-medium border-t">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
