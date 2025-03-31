
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRequests } from '@/contexts/RequestContext';
import { useClients } from '@/contexts/ClientContext';
import { NewRequest } from '@/types/request';

const requestFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  clientId: z.string().min(1, { message: "Please select a client" }),
  propertyType: z.string().min(1, { message: "Please select a property type" }),
  status: z.enum(['new', 'assessment_complete', 'overdue', 'unscheduled']),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

const NewRequest = () => {
  const navigate = useNavigate();
  const { addRequest } = useRequests();
  const { clients } = useClients();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      clientId: "",
      propertyType: "",
      status: "new",
    },
  });

  const onSubmit = async (values: RequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      const newRequest: NewRequest = {
        title: values.title,
        description: values.description,
        clientId: values.clientId,
        propertyType: values.propertyType,
        status: values.status,
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

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Request Information
          </CardTitle>
          <CardDescription>
            Enter the details for the new request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input placeholder="Enter request title" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the request in detail" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="assessment_complete">Assessment Complete</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="unscheduled">Unscheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/requests')} 
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Request"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRequest;
