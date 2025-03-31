
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FileText, ArrowLeft, Pencil, Trash2, Clock, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useRequests } from '@/contexts/RequestContext';
import { useClients } from '@/contexts/ClientContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, deleteRequest } = useRequests();
  const { getClientById } = useClients();
  const { toast } = useToast();
  
  const request = getRequestById(id || '');
  const client = request ? getClientById(request.clientId) : undefined;
  
  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-2xl font-bold mb-4">Request not found</h1>
        <p className="text-muted-foreground mb-6">The request you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/requests">Go to Requests</Link>
        </Button>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteRequest(request.id);
    toast({
      title: "Request deleted",
      description: "The request has been deleted successfully.",
    });
    navigate('/requests');
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date instanceof Date ? date : new Date(date));
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">New</Badge>;
      case 'assessment_complete':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Assessment Complete</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Overdue</Badge>;
      case 'unscheduled':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">Unscheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Request from {client?.name || 'Unknown Client'}</p>
            {getStatusBadge(request.status)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/requests/${request.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this request.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{request.description}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Property Type</h4>
                    <p className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {request.propertyType}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                    <p>{getStatusBadge(request.status)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDate(request.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {client && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                  <p>{client.name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact</h4>
                  <p>{client.email}</p>
                  <p>{client.phone}</p>
                </div>
                
                {client.address && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                    <p>{client.address}</p>
                    <p>{client.city}, {client.state} {client.zip}</p>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/clients/${client.id}`}>
                      View Client
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestDetail;
