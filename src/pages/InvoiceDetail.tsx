
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ChevronDown, 
  Printer, 
  Send, 
  Download, 
  CircleDollarSign, 
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

import { useInvoices } from '@/contexts/InvoiceContext';
import { useClients } from '@/contexts/ClientContext';
import { InvoiceStatus } from '@/types/invoice';

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, deleteInvoice, updateInvoiceStatus } = useInvoices();
  const { getClientById } = useClients();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const invoice = id ? getInvoiceById(id) : undefined;
  const client = invoice ? getClientById(invoice.clientId) : undefined;
  
  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-6xl mb-4">🧾</div>
        <h1 className="text-2xl font-bold mb-2">Invoice Not Found</h1>
        <p className="text-muted-foreground mb-6">The invoice you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link to="/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    toast({
      title: "Invoice deleted",
      description: `Invoice #${invoice.number} has been deleted successfully.`,
    });
    navigate('/invoices');
  };

  const updateStatus = (status: InvoiceStatus) => {
    updateInvoiceStatus(invoice.id, status);
    
    let message = "";
    switch (status) {
      case 'draft':
        message = "Invoice marked as draft";
        break;
      case 'sent':
        message = "Invoice marked as sent to client";
        break;
      case 'paid':
        message = "Invoice marked as paid";
        break;
      case 'past_due':
        message = "Invoice marked as past due";
        break;
    }
    
    toast({
      title: "Status updated",
      description: message,
    });
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sent</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'past_due':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Past Due</Badge>;
    }
  };

  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/invoices">Invoices</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Invoice #{invoice.number}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Invoice #{invoice.number}</h1>
            {getStatusBadge(invoice.status)}
          </div>
          <p className="text-muted-foreground">
            {client ? `Client: ${client.name}` : 'No client assigned'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Update Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateStatus('sent')}>
                <Send className="mr-2 h-4 w-4 text-blue-500" />
                <span>Mark as Sent</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('paid')}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Mark as Paid</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('past_due')}>
                <Clock className="mr-2 h-4 w-4 text-red-500" />
                <span>Mark as Past Due</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('draft')}>
                <Edit className="mr-2 h-4 w-4 text-gray-500" />
                <span>Mark as Draft</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                <span>Send to Client</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print Invoice</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download PDF</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/invoices/${invoice.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Billed To</p>
                  {client ? (
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p>{client.address}</p>
                      <p>{client.city}, {client.state} {client.zip}</p>
                      <p>{client.email}</p>
                    </div>
                  ) : (
                    <p className="italic text-muted-foreground">No client information</p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                    <p className="font-medium">#{invoice.number}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
                    <p>{format(new Date(invoice.date), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                    <p>{format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                {invoice.subject && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-1">Subject</h3>
                    <p>{invoice.subject}</p>
                  </div>
                )}
                
                <h3 className="font-medium mb-4">Invoice Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Item</TableHead>
                      <TableHead className="w-[15%] text-right">Qty</TableHead>
                      <TableHead className="w-[15%] text-right">Unit Price</TableHead>
                      <TableHead className="w-[20%] text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 flex justify-end">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal</span>
                      <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tax</span>
                      <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${invoice.total.toFixed(2)}</span>
                    </div>
                    {invoice.balance > 0 && (
                      <div className="flex justify-between text-red-600 font-bold mt-1">
                        <span>Balance Due</span>
                        <span>${invoice.balance.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {(invoice.notes || invoice.terms) && (
                <>
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {invoice.notes && (
                      <div>
                        <h3 className="font-medium mb-1">Notes</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
                      </div>
                    )}
                    
                    {invoice.terms && (
                      <div>
                        <h3 className="font-medium mb-1">Terms & Conditions</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.terms}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <span>{getStatusBadge(invoice.status)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Amount</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Balance Due</span>
                  <span>${invoice.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Due Date</span>
                  <span>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </CardContent>
            
            {invoice.status !== 'paid' && invoice.balance > 0 && (
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => updateStatus('paid')}
                >
                  <CircleDollarSign className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Invoice Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <Edit className="h-4 w-4 text-blue-700" />
                    </div>
                    <span>Invoice created</span>
                  </div>
                  <span className="text-muted-foreground">
                    {format(new Date(invoice.createdAt), 'MMM d')}
                  </span>
                </div>
                
                {invoice.status !== 'draft' && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <Send className="h-4 w-4 text-blue-700" />
                      </div>
                      <span>Invoice sent</span>
                    </div>
                    <span className="text-muted-foreground">
                      {format(new Date(invoice.updatedAt), 'MMM d')}
                    </span>
                  </div>
                )}
                
                {invoice.status === 'paid' && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <CircleDollarSign className="h-4 w-4 text-green-700" />
                      </div>
                      <span>Payment received</span>
                    </div>
                    <span className="text-muted-foreground">
                      {format(new Date(invoice.updatedAt), 'MMM d')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Invoice #{invoice.number} from your records.
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

export default InvoiceDetail;
