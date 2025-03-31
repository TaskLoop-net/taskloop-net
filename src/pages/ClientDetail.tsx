
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Home, 
  ClipboardList,
  FileText,
  Briefcase,
  ArrowLeft,
  Edit,
  Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useClients } from '@/contexts/ClientContext';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, deleteClient } = useClients();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const client = getClientById(id || '');
  
  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Client not found</h2>
        <p className="text-muted-foreground mb-6">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/clients')}>
          Back to Clients
        </Button>
      </div>
    );
  }

  const handleDeleteClient = () => {
    deleteClient(client.id);
    navigate('/clients');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div>
      <div className="flex items-center mb-6 gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold flex-grow">{client.name}</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/clients/${client.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Client</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {client.name}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteClient}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-gray-500">Client since {formatDate(client.createdAt)}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <div className="text-sm">{client.email}</div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <div className="text-sm">{client.phone}</div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div className="text-sm">
                {client.address}<br />
                {client.city}, {client.state} {client.zip}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div className="text-sm font-medium">Outstanding Balance</div>
              </div>
              <div className={`font-semibold ${client.balance > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                ${client.balance.toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Home className="h-5 w-5 text-gray-400 mr-2" />
                <div className="text-sm font-medium">Properties</div>
              </div>
              <div>{client.properties}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {client.notes || 'No notes added yet.'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">
            <Briefcase className="h-4 w-4 mr-1" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="quotes">
            <FileText className="h-4 w-4 mr-1" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="requests">
            <ClipboardList className="h-4 w-4 mr-1" />
            Requests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No jobs yet</h3>
            <p className="text-gray-500 mb-4">This client doesn't have any jobs created yet.</p>
            <Button>Create a Job</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="quotes" className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No quotes yet</h3>
            <p className="text-gray-500 mb-4">This client doesn't have any quotes created yet.</p>
            <Button>Create a Quote</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No requests yet</h3>
            <p className="text-gray-500 mb-4">This client doesn't have any requests created yet.</p>
            <Button>Create a Request</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
