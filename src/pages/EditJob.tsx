
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Plus, Trash2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useJobs } from '@/contexts/JobContext';
import { useClients } from '@/contexts/ClientContext';
import type { LineItem, Job } from '@/types/job';

const jobFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  clientId: z.string().min(1, { message: "Please select a client" }),
  type: z.enum(['one_off', 'recurring']),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  startDate: z.date({ required_error: "Please select a start date" }),
  endDate: z.date().optional(),
  scheduledTime: z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional()
  }).optional(),
  teamMembers: z.array(z.string()).default([]),
  invoiceOnCompletion: z.boolean().default(false),
  internalNotes: z.string().optional()
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, updateJob } = useJobs();
  const { clients } = useClients();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lineItems, setLineItems] = useState<Array<LineItem>>([]);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (id) {
      const jobData = getJobById(id);
      if (jobData) {
        setJob(jobData);
        setLineItems(jobData.lineItems || []);
      } else {
        toast({
          title: "Job not found",
          description: "The job you are trying to edit doesn't exist.",
          variant: "destructive",
        });
        navigate('/jobs');
      }
    }
  }, [id, getJobById, navigate, toast]);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      clientId: job?.clientId || "",
      type: job?.type || "one_off",
      status: job?.status || "scheduled",
      startDate: job?.startDate ? new Date(job.startDate) : new Date(),
      teamMembers: job?.teamMembers || [],
      invoiceOnCompletion: job?.invoiceOnCompletion || false,
      internalNotes: job?.internalNotes || ""
    },
    values: job ? {
      title: job.title,
      description: job.description || "",
      clientId: job.clientId,
      type: job.type,
      status: job.status,
      startDate: new Date(job.startDate),
      endDate: job.endDate ? new Date(job.endDate) : undefined,
      scheduledTime: job.scheduledTime,
      teamMembers: job.teamMembers,
      invoiceOnCompletion: job.invoiceOnCompletion,
      internalNotes: job.internalNotes || ""
    } : undefined
  });

  const addLineItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prevItems => {
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

  const removeLineItem = (id: string) => {
    setLineItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const onSubmit = async (values: JobFormValues) => {
    if (!job) return;
    
    setIsSubmitting(true);
    
    try {
      if (lineItems.some(item => !item.name)) {
        toast({
          title: "Validation Error",
          description: "All line items must have a name.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      updateJob(job.id, {
        ...values,
        lineItems,
        totalPrice: parseFloat(calculateTotal()),
        // Ensure the type is properly set
        title: values.title,
        description: values.description || "",
        clientId: values.clientId,
        type: values.type,
        status: values.status,
        startDate: values.startDate
      });
      
      toast({
        title: "Job updated",
        description: "Your job has been updated successfully.",
      });
      
      navigate(`/jobs/${job.id}`);
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "There was an error updating your job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
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
          <h1 className="text-2xl font-bold">Edit Job</h1>
          <p className="text-muted-foreground">Update job details</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Job Information
          </CardTitle>
          <CardDescription>
            Edit the details of the job
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the job in detail" 
                        className="min-h-32" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="one_off">One-off Job</SelectItem>
                          <SelectItem value="recurring">Recurring Job</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Line Items</h3>
                  <Button type="button" onClick={addLineItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {lineItems.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No items added yet. Click "Add Item" to add an item.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lineItems.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-start border rounded-md p-3">
                        <div className="col-span-12 md:col-span-5">
                          <FormLabel className="text-xs">Name</FormLabel>
                          <Input
                            value={item.name}
                            onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                            placeholder="Item name"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <FormLabel className="text-xs">Quantity</FormLabel>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                            min="1"
                            step="1"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <FormLabel className="text-xs">Unit Price ($)</FormLabel>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
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
                            onClick={() => removeLineItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end mt-4">
                      <div className="w-48">
                        <div className="flex justify-between px-4 py-2 font-medium">
                          <span>Total:</span>
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6">
                <FormField
                  control={form.control}
                  name="invoiceOnCompletion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Invoice on completion</FormLabel>
                        <FormDescription>
                          Automatically create an invoice when this job is marked as completed
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="internalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add internal notes (not visible to clients)" 
                        className="min-h-24" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes are only visible to your team
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/jobs/${job.id}`)} 
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

export default EditJob;
