
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar, FileText, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useRequests } from '@/contexts/RequestContext';
import { useClients } from '@/contexts/ClientContext';
import type { NewRequest } from '@/types/request';

const requestFormSchema = z.object({
  clientId: z.string().min(1, { message: "Please select a client" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  requestedOn: z.date().optional().default(() => new Date()),
  preferredDate: z.date().optional(),
  alternateDate: z.date().optional(),
  preferredTimes: z.array(z.string()).optional(),
  requiresOnSiteAssessment: z.boolean().default(false),
  internalNotes: z.string().optional(),
  linkedQuotes: z.boolean().default(false),
  linkedJobs: z.boolean().default(false),
  linkedInvoices: z.boolean().default(false),
  propertyType: z.string().optional(),
  status: z.enum(['new', 'assessment_complete', 'overdue', 'unscheduled']).default('new'),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

const NewRequest = () => {
  const navigate = useNavigate();
  const { addRequest } = useRequests();
  const { clients, getClientById } = useClients();
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploads, setFileUploads] = useState<File[]>([]);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      clientId: "",
      requestedOn: new Date(),
      preferredTimes: [],
      requiresOnSiteAssessment: false,
      internalNotes: "",
      linkedQuotes: false,
      linkedJobs: false,
      linkedInvoices: false,
      status: "new",
    },
  });

  const onSubmit = async (values: RequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      const newRequest: NewRequest = {
        title: values.title,
        description: values.description || "",
        clientId: values.clientId,
        propertyType: values.propertyType || "",
        status: values.status,
        requestedOn: values.requestedOn,
        preferredDate: values.preferredDate,
        alternateDate: values.alternateDate,
        preferredTimes: values.preferredTimes,
        requiresOnSiteAssessment: values.requiresOnSiteAssessment,
        internalNotes: values.internalNotes,
        linkedQuotes: values.linkedQuotes,
        linkedJobs: values.linkedJobs,
        linkedInvoices: values.linkedInvoices,
      };
      
      const request = addRequest(newRequest);
      
      toast({
        title: "Request created",
        description: "Your request has been created successfully.",
      });
      
      navigate(`/requests/${request.id}`);
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Error",
        description: "There was an error creating your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId);
    form.setValue("clientId", clientId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFileUploads((prev) => [...prev, ...newFiles]);
    }
  };

  const timeOptions = [
    { id: 'any', label: 'Any time' },
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'evening', label: 'Evening' },
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Request</h1>
          <p className="text-muted-foreground">Create a new client request</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  Request for {selectedClient ? getClientById(selectedClient)?.name : "Client Name"}
                  <Button variant="outline" size="sm" className="h-7 px-2 rounded-full bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Client Selection and Request Title */}
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={handleClientChange} defaultValue={field.value}>
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
                      </FormItem>
                    )}
                  />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Request title</h3>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Request title" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                
                  {/* Service Details */}
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">Service Details</h3>
                    <p className="text-sm text-muted-foreground mb-2">Please provide as much information as you can</p>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the service needed in detail" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Availability Section */}
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-4">Your Availability</h3>
                    
                    <div className="space-y-4">
                      {/* Preferred Date */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Which day would be best for an assessment of the work?</h4>
                        <FormField
                          control={form.control}
                          name="preferredDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="pl-3 text-left font-normal justify-between"
                                    >
                                      {field.value ? format(field.value, "PPP") : "Select a date"}
                                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Alternate Date */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">What is another day that works for you?</h4>
                        <FormField
                          control={form.control}
                          name="alternateDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="pl-3 text-left font-normal justify-between"
                                    >
                                      {field.value ? format(field.value, "PPP") : "Select a date"}
                                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Preferred Times */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">What are your preferred arrival times?</h4>
                        <div className="space-y-2">
                          {timeOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="preferredTimes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          const newValues = checked
                                            ? [...currentValues, option.id]
                                            : currentValues.filter((value) => value !== option.id);
                                          field.onChange(newValues);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* On-site Assessment */}
                  <div className="pt-4">
                    <FormField
                      control={form.control}
                      name="requiresOnSiteAssessment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">On-site assessment required</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Schedule an assessment to collect more information before the job
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Request Details */}
                  <div>
                    <h3 className="text-sm font-medium">Request details</h3>
                    <div className="flex items-center mt-2">
                      <p className="text-sm text-muted-foreground">Requested on</p>
                      <div className="ml-auto">
                        <FormField
                          control={form.control}
                          name="requestedOn"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="pl-3 text-left font-normal"
                                      size="sm"
                                    >
                                      {field.value ? format(field.value, "MMM d, yyyy") : "Select date"}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Internal Notes */}
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">Internal notes</h3>
                    <p className="text-sm text-muted-foreground mb-4">Internal notes will only be seen by your team</p>
                    <FormField
                      control={form.control}
                      name="internalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Note details" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* File Upload */}
                  <div className="pt-4">
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Drag your files here or</p>
                      <div className="flex justify-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                            Select a File
                          </span>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                      {fileUploads.length > 0 && (
                        <div className="mt-4 text-left">
                          <p className="text-sm font-medium mb-2">Uploaded files:</p>
                          <ul className="text-sm">
                            {fileUploads.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Link Note to Related */}
                  <div className="pt-4">
                    <h3 className="text-base font-medium mb-3">Link note to related</h3>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="linkedQuotes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Quotes</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="linkedJobs"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                        name="linkedInvoices"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/requests')}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Select Client"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewRequest;
