
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  ChevronDown, 
  UserPlus,
  DollarSign,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useJobs } from '@/contexts/JobContext';
import { useClients } from '@/contexts/ClientContext';
import { JobStatus } from '@/types/job';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, deleteJob, updateJob } = useJobs();
  const { getClientById } = useClients();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const job = getJobById(id || '');
  const client = job ? getClientById(job.clientId) : undefined;
  
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/jobs">Go to Jobs</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteJob(job.id);
    toast({
      title: "Job deleted",
      description: `${job.title} has been deleted successfully.`,
    });
    navigate('/jobs');
  };

  const updateStatus = (newStatus: JobStatus) => {
    updateJob(job.id, { status: newStatus });
    toast({
      title: "Status updated",
      description: `Job status changed to ${newStatus.replace('_', ' ')}.`,
    });
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'scheduled':
        return <span className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium"><Calendar className="h-3 w-3 mr-1" /> Scheduled</span>;
      case 'in_progress':
        return <span className="flex items-center bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs font-medium"><Clock className="h-3 w-3 mr-1" /> In Progress</span>;
      case 'completed':
        return <span className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium"><CheckCircle className="h-3 w-3 mr-1" /> Completed</span>;
      case 'cancelled':
        return <span className="flex items-center bg-red-100 text-red-800 rounded-full px-3 py-1 text-xs font-medium"><XCircle className="h-3 w-3 mr-1" /> Cancelled</span>;
    }
  };

  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/jobs">Jobs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{job.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            {getStatusBadge(job.status)}
          </div>
          <p className="text-muted-foreground">
            {client ? `Client: ${client.name}` : 'No client assigned'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Status Update Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Update Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateStatus('scheduled')}>
                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                <span>Scheduled</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('in_progress')}>
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                <span>In Progress</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('completed')}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Completed</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateStatus('cancelled')}>
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                <span>Cancelled</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/jobs/${job.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Create Invoice</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="details" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">
                      {job.type === 'one_off' ? 'One-off Job' : 'Recurring Job'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Job Date</p>
                    <p className="font-medium">
                      {format(new Date(job.startDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{job.description || 'No description provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                {client ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{client.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p>{client.email}</p>
                      <p>{client.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p>
                        {client.address}<br />
                        {client.city}, {client.state} {client.zip}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No client information available</p>
                  </div>
                )}
              </CardContent>
              {client && (
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/clients/${client.id}`}>
                      View Client Details
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Team Members</CardTitle>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Assign Team Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {job.teamMembers && job.teamMembers.length > 0 ? (
                <div className="space-y-2">
                  {job.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                          {member.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{member}</p>
                          <p className="text-sm text-muted-foreground">Team Member</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">No team members assigned yet</p>
                  <Button variant="outline" className="mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Team Member
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financials" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Line Items</CardTitle>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Line Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {job.lineItems && job.lineItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="w-20">Quantity</TableHead>
                      <TableHead className="w-32">Unit Price</TableHead>
                      <TableHead className="w-32 text-right">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {job.lineItems.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">No line items added yet</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line Item
                  </Button>
                </div>
              )}
            </CardContent>
            {job.lineItems && job.lineItems.length > 0 && (
              <CardFooter className="border-t flex justify-end">
                <div className="w-64 space-y-1">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>${job.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold py-2 border-t">
                    <span>Total:</span>
                    <span>${job.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Internal Notes</CardTitle>
              <CardDescription>
                These notes are only visible to your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {job.internalNotes ? (
                <div className="whitespace-pre-wrap">{job.internalNotes}</div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No internal notes have been added yet</p>
                  <Button variant="outline" className="mt-4">
                    <Edit className="h-4 w-4 mr-2" />
                    Add Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job and remove it from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobDetail;
