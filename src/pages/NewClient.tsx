
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClients } from '@/contexts/ClientContext';
import { NewClient } from '@/types/client';

const formSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  companyName: z.string().optional(),
  useCompanyName: z.boolean().default(false),
  phoneNumber: z.string().min(10, { message: "Phone number is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  
  // Property details
  street1: z.string().min(1, { message: "Street address is required." }),
  street2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().min(5, { message: "ZIP code is required." }),
  country: z.string().default("United States"),
  
  // Billing address
  sameBillingAddress: z.boolean().default(true),
});

const titleOptions = ["No title", "Mr", "Mrs", "Ms", "Dr", "Prof"];
const phoneTypes = ["Main", "Mobile", "Work", "Home", "Other"];

const NewClientPage = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdditionalClientDetails, setShowAdditionalClientDetails] = useState(false);
  const [showAdditionalPropertyDetails, setShowAdditionalPropertyDetails] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "No title",
      firstName: '',
      lastName: '',
      companyName: '',
      useCompanyName: false,
      phoneNumber: '',
      email: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      sameBillingAddress: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Format name based on whether to use company name
      const name = values.useCompanyName && values.companyName 
        ? values.companyName 
        : `${values.firstName} ${values.lastName}`;
      
      // Explicitly type values as NewClient to ensure type safety
      const newClient: NewClient = {
        name,
        email: values.email,
        phone: values.phoneNumber,
        address: `${values.street1}${values.street2 ? ', ' + values.street2 : ''}`,
        city: values.city,
        state: values.state,
        zip: values.zipCode,
        notes: '',
      };
      
      const client = addClient(newClient);
      setIsSubmitting(false);
      navigate(`/clients/${client.id}`);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error adding client:", error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Client</h1>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Client details section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Client details</h2>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Title" />
                          </SelectTrigger>
                          <SelectContent>
                            {titleOptions.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useCompanyName"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Use company name as the primary name</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Contact Details</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4">
                      <FormField
                        control={form.control}
                        name="title" // Reusing title field as phone type for simplicity
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <Select
                              value={phoneTypes[0]}
                              onValueChange={() => {}}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Main" />
                              </SelectTrigger>
                              <SelectContent>
                                {phoneTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="col-span-4">
                            <FormControl>
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="text-taskloop-gray"
                      type="button"
                    >
                      Add Phone Number
                    </Button>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-5 gap-4">
                      <FormField
                        control={form.control}
                        name="title" // Reusing title field as email type for simplicity
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <Select
                              value={phoneTypes[0]}
                              onValueChange={() => {}}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Main" />
                              </SelectTrigger>
                              <SelectContent>
                                {phoneTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-4">
                            <FormControl>
                              <Input placeholder="Email address" type="email" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="text-taskloop-gray"
                      type="button"
                    >
                      Add Email Address
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="text-taskloop-gray"
                      type="button"
                    >
                      Lead Source <span className="ml-2">+</span>
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full flex justify-between items-center"
                    onClick={() => setShowAdditionalClientDetails(!showAdditionalClientDetails)}
                  >
                    <span>Additional client details</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${showAdditionalClientDetails ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {/* Property details section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Property details</h2>
                </div>
                
                <FormField
                  control={form.control}
                  name="street1"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Street 1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Street 2" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Zip code" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Mexico">Mexico</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sameBillingAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Billing address is the same as property address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="border-t pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full flex justify-between items-center"
                    onClick={() => setShowAdditionalPropertyDetails(!showAdditionalPropertyDetails)}
                  >
                    <span>Additional property details</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${showAdditionalPropertyDetails ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/clients')}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  disabled={isSubmitting}
                >
                  Save And Create Another
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  Save Client
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default NewClientPage;
