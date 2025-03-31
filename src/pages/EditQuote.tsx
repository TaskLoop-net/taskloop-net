
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Info } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useQuotes } from '@/contexts/QuoteContext';
import { useClients } from '@/contexts/ClientContext';

// Define the schema for validation
const formSchema = z.object({
  clientId: z.string().min(1, { message: 'Client is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  items: z.array(z.object({
    id: z.string().optional(), // Only required for existing items
    name: z.string().min(1, { message: 'Item name is required' }),
    description: z.string().optional(),
    quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1' }),
    unitPrice: z.coerce.number().min(0, { message: 'Price must be a positive number' })
  })).min(1, { message: 'At least one item is required' }),
  tax: z.coerce.number().min(0, { message: 'Tax rate must be a positive number' }),
  validUntil: z.string().min(1, { message: 'Valid until date is required' }),
  notes: z.string().optional(),
  status: z.enum(['draft', 'sent', 'approved', 'rejected', 'changes_requested'])
});

type FormValues = z.infer<typeof formSchema>;

const EditQuote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuoteById, updateQuote } = useQuotes();
  const { clients } = useClients();
  const [calculatedSubtotal, setCalculatedSubtotal] = useState<number>(0);

  const quote = getQuoteById(id || '');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      title: '',
      description: '',
      items: [],
      tax: 10,
      validUntil: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'draft' as const
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control: form.control
  });

  // Load quote data when component mounts
  useEffect(() => {
    if (quote) {
      form.reset({
        clientId: quote.clientId,
        title: quote.title,
        description: quote.description || '',
        items: quote.items,
        tax: (quote.tax / quote.subtotal) * 100, // Convert back to percentage
        validUntil: quote.validUntil.toISOString().split('T')[0],
        notes: quote.notes || '',
        status: quote.status
      });
      
      // Initialize calculated subtotal
      setCalculatedSubtotal(quote.subtotal);
    } else {
      navigate('/quotes');
    }
  }, [quote, form, navigate]);

  // Calculate subtotal and tax whenever items change
  React.useEffect(() => {
    const values = form.getValues();
    const subtotal = values.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);
    
    setCalculatedSubtotal(subtotal);
  }, [form.watch('items')]);

  if (!quote) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Quote not found</h2>
        <p className="text-muted-foreground mb-6">
          The quote you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/quotes')}>
          Back to Quotes
        </Button>
      </div>
    );
  }

  const onSubmit = (data: FormValues) => {
    // Convert date string to Date object
    const validUntil = new Date(data.validUntil);
    
    // Prepare items with or without IDs
    const items = data.items.map(item => ({
      id: item.id || undefined, // Only include id if it exists
      name: item.name,
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice)
    }));
    
    // Calculate subtotal and tax
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = (subtotal * Number(data.tax)) / 100;
    
    // Update quote
    updateQuote(quote.id, {
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      items,
      subtotal,
      tax,
      total: subtotal + tax,
      validUntil,
      notes: data.notes,
      status: data.status
    });
    
    navigate(`/quotes/${quote.id}`);
  };

  // Calculate total with tax
  const calculateTotal = () => {
    const tax = (calculatedSubtotal * Number(form.watch('tax') || 0)) / 100;
    return calculatedSubtotal + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/quotes/${quote.id}`)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Quote</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quote Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid Until</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
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
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="changes_requested">Changes Requested</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Quote Items</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', description: '', quantity: 1, unitPrice: 0 })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-3 border rounded-md relative">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                className="resize-none h-16" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No items added. Click "Add Item" to add quote items.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quote Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Subtotal</span>
                      <span>{formatCurrency(calculatedSubtotal)}</span>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name="tax"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <FormLabel className="text-sm">Tax Rate (%)</FormLabel>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Set your tax rate percentage</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" {...field} className="max-w-20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="text-right">
                        <span>{formatCurrency((calculatedSubtotal * Number(form.watch('tax') || 0)) / 100)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(`/quotes/${quote.id}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditQuote;
