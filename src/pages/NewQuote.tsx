
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye, Star, Download, FileText } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import { useQuotes } from '@/contexts/QuoteContext';
import { useClients } from '@/contexts/ClientContext';

// Define the schema for validation
const formSchema = z.object({
  clientId: z.string().min(1, { message: 'Client is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  items: z.array(z.object({
    name: z.string().min(1, { message: 'Item name is required' }),
    description: z.string().optional(),
    quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1' }),
    unitPrice: z.coerce.number().min(0, { message: 'Price must be a positive number' })
  })).min(1, { message: 'At least one item is required' }),
  tax: z.coerce.number().min(0, { message: 'Tax rate must be a positive number' }),
  validUntil: z.string().min(1, { message: 'Valid until date is required' }),
  notes: z.string().optional(),
  clientMessage: z.string().optional(),
  disclaimer: z.string().optional(),
  internalNotes: z.string().optional(),
  discount: z.coerce.number().optional(),
  deposit: z.coerce.number().optional(),
  linkJobs: z.boolean().optional(),
  linkInvoices: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewQuote = () => {
  const navigate = useNavigate();
  const { addQuote } = useQuotes();
  const { clients } = useClients();
  const [calculatedSubtotal, setCalculatedSubtotal] = useState<number>(0);
  const [quoteNumber] = useState(`#${Math.floor(1000 + Math.random() * 9000)}`);
  const [rating, setRating] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      title: '',
      description: '',
      items: [{ name: '', description: '', quantity: 1, unitPrice: 0 }],
      tax: 0,
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      notes: '',
      clientMessage: '',
      disclaimer: 'This quote is valid for the next 30 days, after which values may be subject to change.',
      internalNotes: '',
      discount: 0,
      deposit: 0,
      linkJobs: false,
      linkInvoices: false
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control: form.control
  });

  // Calculate subtotal whenever items change
  React.useEffect(() => {
    const values = form.getValues();
    const subtotal = values.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);
    
    setCalculatedSubtotal(subtotal);
  }, [form.watch('items')]);

  const onSubmit = (data: FormValues) => {
    // Convert date string to Date object
    const validUntil = new Date(data.validUntil);
    
    // Create new quote
    const newQuote = {
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      items: data.items.map(item => ({
        name: item.name,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      })),
      tax: Number(data.tax),
      validUntil,
      notes: data.notes
    };
    
    const quote = addQuote(newQuote);
    navigate(`/quotes/${quote.id}`);
  };

  // Calculate total with tax
  const calculateTotal = () => {
    const discount = Number(form.watch('discount') || 0);
    const tax = (calculatedSubtotal * Number(form.watch('tax') || 0)) / 100;
    return calculatedSubtotal - discount + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/quotes')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">New Quote</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Quote for</h2>
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem className="w-64">
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-b border-dashed border-t-0 border-x-0 rounded-none font-semibold text-xl px-0">
                                <SelectValue placeholder="Client Name" />
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
                    <Button variant="outline" size="icon" className="rounded-full bg-green-500 text-white h-6 w-6">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-500 mb-1">Job title</h3>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Title" {...field} className="border-0 border-b border-gray-200 rounded-none px-0 py-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium">Quote details</h3>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-sm">Quote number {quoteNumber}</p>
                      <Button variant="link" size="sm" className="p-0 h-auto text-green-600">Change</Button>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h3 className="text-sm">Rate opportunity</h3>
                    <div className="flex justify-end mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button 
                          key={star} 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 w-6 h-6"
                          onClick={() => handleStarClick(star)}
                        >
                          <Star 
                            className="h-5 w-5" 
                            fill={rating >= star ? "#FFD700" : "transparent"} 
                            color={rating >= star ? "#FFD700" : "#D1D5DB"} 
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 border border-gray-100 p-3 rounded-md max-w-xs">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Custom fields</span> let you track additional details on your
                      quote, like the salesperson or referral source.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="mb-8">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm mb-2 px-2">
                  <div className="col-span-5">Product / Service</div>
                  <div className="col-span-2 text-center">Qty.</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-4 mb-4 items-start">
                    <div className="col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Name" className="mb-2" />
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
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Description" 
                                className="resize-none h-20" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="text" 
                                {...field} 
                                value={field.value === 0 ? '$0.00' : formatCurrency(Number(field.value)).replace('$', '')}
                                onChange={e => {
                                  const value = e.target.value.replace(/[^\d.]/g, '');
                                  field.onChange(value === '' ? 0 : parseFloat(value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="col-span-3 flex justify-between items-center">
                      <span className="text-right flex-1">
                        {formatCurrency(Number(field.quantity) * Number(field.unitPrice))}
                      </span>
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
                  </div>
                ))}
                
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', description: '', quantity: 1, unitPrice: 0 })}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line Item
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Client view</span>
                  <Button variant="link" size="sm" className="p-0 h-auto">Change</Button>
                </div>
              </div>
              
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Subtotal</span>
                    <span>{formatCurrency(calculatedSubtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Discount</span>
                    <Button variant="link" size="sm" className="p-0 h-auto text-green-600">
                      Add Discount
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Tax</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-green-600"
                      onClick={() => {
                        const currentTax = form.getValues().tax;
                        form.setValue('tax', currentTax > 0 ? 0 : 10);
                      }}
                    >
                      Add Tax
                    </Button>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between items-center py-2 font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Required deposit</span>
                    <Button variant="link" size="sm" className="p-0 h-auto text-green-600">
                      Add Required Deposit
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium mb-3">Client message</h3>
                <FormField
                  control={form.control}
                  name="clientMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Add a message to your client" 
                          className="resize-none h-28" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium mb-3">Contract / Disclaimer</h3>
                <FormField
                  control={form.control}
                  name="disclaimer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="resize-none h-16" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium mb-1">Internal notes</h3>
                <p className="text-xs text-gray-500 mb-3">Internal notes will only be seen by your team</p>
                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Note details" 
                          className="resize-none h-28" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-8">
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                  <p className="text-sm text-gray-500">Drag your files here or</p>
                  <Button variant="ghost" size="sm" className="text-green-600 mt-1">
                    Select a File
                  </Button>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm mb-3">Link note to related</h3>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="linkJobs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Jobs</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="linkInvoices"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Invoices</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Select Client
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NewQuote;

