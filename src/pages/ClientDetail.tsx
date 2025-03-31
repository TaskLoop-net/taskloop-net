
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  File, 
  PenTool, 
  Briefcase, 
  DollarSign,
  Plus,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock client data - in a real app, fetch based on the ID
  const client = {
    id: id || '1',
    name: 'Michael Jones',
    email: 'michael.jones@example.com',
    phone: '(310) 555-1234',
    address: '123 Main St, Los Angeles, CA 90001',
    balance: 1922,
    properties: [
      {
        id: 'p1',
        address: '123 Main St, Los Angeles, CA 90001',
        type: 'Residential'
      },
      {
        id: 'p2',
        address: '456 Business Ave, Los Angeles, CA 90012',
        type: 'Commercial'
      }
    ],
    requests: [
      {
        id: 'r1',
        title: 'AC Repair',
        date: '2023-03-15',
        status: 'Completed'
      }
    ],
    quotes: [
      {
        id: 'q1',
        title: 'Annual Maintenance Contract',
        date: '2023-03-20',
        amount: 1200,
        status: 'Approved'
      }
    ],
    jobs: [
      {
        id: 'j1',
        title: 'Quarterly HVAC Maintenance',
        date: '2023-03-25',
        status: 'Scheduled'
      }
    ],
    invoices: [
      {
        id: 'i1',
        number: '#186',
        date: '2023-03-28',
        amount: 1922,
        status: 'Due'
      }
    ],
    notes: [
      {
        id: 'n1',
        text: 'Client prefers morning appointments before 11 AM',
        createdAt: '2023-02-12',
        author: 'Alex Rodriguez'
      }
    ]
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/clients" className="text-taskloop-blue hover:underline inline-flex items-center mb-3">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to clients
        </Link>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
            <Button className="bg-taskloop-blue hover:bg-taskloop-darkblue">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex flex-col space-y-4">
              <div className="mx-auto">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-500" />
                </div>
              </div>
              
              <div className="mt-2 space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{client.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{client.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{client.email}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Balance</span>
                    <span className="text-sm font-semibold text-red-600">${client.balance.toLocaleString()}</span>
                  </div>
                  <Button className="w-full text-sm mt-2" variant="outline">View statement</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="properties">
            <TabsList className="mb-4">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Properties</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Property
                </Button>
              </div>
              
              <div className="space-y-3">
                {client.properties.map(property => (
                  <div key={property.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{property.address}</p>
                        <p className="text-sm text-gray-600">{property.type}</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="requests" className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-taskloop-blue mr-2" />
                  <h2 className="text-lg font-medium">Requests</h2>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Request
                </Button>
              </div>
              
              {client.requests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-left text-gray-500 border-b">
                        <th className="pb-2">Title</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.requests.map(request => (
                        <tr key={request.id} className="border-b">
                          <td className="py-3">{request.title}</td>
                          <td className="py-3">{request.date}</td>
                          <td className="py-3">
                            <span className="status-badge status-completed">{request.status}</span>
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No requests found</div>
              )}
            </TabsContent>
            
            <TabsContent value="quotes" className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <PenTool className="h-5 w-5 text-taskloop-blue mr-2" />
                  <h2 className="text-lg font-medium">Quotes</h2>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Quote
                </Button>
              </div>
              
              {client.quotes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-left text-gray-500 border-b">
                        <th className="pb-2">Title</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.quotes.map(quote => (
                        <tr key={quote.id} className="border-b">
                          <td className="py-3">{quote.title}</td>
                          <td className="py-3">{quote.date}</td>
                          <td className="py-3">${quote.amount}</td>
                          <td className="py-3">
                            <span className="status-badge status-in-progress">{quote.status}</span>
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No quotes found</div>
              )}
            </TabsContent>
            
            <TabsContent value="jobs" className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-taskloop-blue mr-2" />
                  <h2 className="text-lg font-medium">Jobs</h2>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Job
                </Button>
              </div>
              
              {client.jobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-left text-gray-500 border-b">
                        <th className="pb-2">Title</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.jobs.map(job => (
                        <tr key={job.id} className="border-b">
                          <td className="py-3">{job.title}</td>
                          <td className="py-3">{job.date}</td>
                          <td className="py-3">
                            <span className="status-badge status-pending">{job.status}</span>
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No jobs found</div>
              )}
            </TabsContent>
            
            <TabsContent value="invoices" className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-taskloop-blue mr-2" />
                  <h2 className="text-lg font-medium">Invoices</h2>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Invoice
                </Button>
              </div>
              
              {client.invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-left text-gray-500 border-b">
                        <th className="pb-2">Number</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.invoices.map(invoice => (
                        <tr key={invoice.id} className="border-b">
                          <td className="py-3">{invoice.number}</td>
                          <td className="py-3">{invoice.date}</td>
                          <td className="py-3">${invoice.amount}</td>
                          <td className="py-3">
                            <span className="status-badge status-overdue">{invoice.status}</span>
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No invoices found</div>
              )}
            </TabsContent>
            
            <TabsContent value="notes" className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Notes</h2>
                <Button size="sm">Add Note</Button>
              </div>
              
              {client.notes.map(note => (
                <div key={note.id} className="p-4 border rounded-lg mb-3">
                  <p className="text-sm mb-2">{note.text}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{note.author}</span>
                    <span>{note.createdAt}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
