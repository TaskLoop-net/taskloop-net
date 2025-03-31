
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  PenTool, 
  Send,
  CheckCircle,
  Printer,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuotes } from '@/contexts/QuoteContext';
import { useClients } from '@/contexts/ClientContext';

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuoteById, deleteQuote, updateQuote } = useQuotes();
  const { getClientById } = useClients();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const quote = getQuoteById(id || '');
  const client = quote ? getClientById(quote.clientId) : undefined;
  
  if (!quote) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Quote not found</h2>
        <p className="text-muted-foreground mb-6">
          The quote you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/quotes')}>
          Back to Quotes
        </Button>
      </div>
    );
  }

  const handleDeleteQuote = () => {
    deleteQuote(quote.id);
    navigate('/quotes');
  };

  const handleStatusChange = (status: 'draft' | 'sent' | 'approved' | 'rejected' | 'changes_requested') => {
    updateQuote(quote.id, { status });
    
    const statusMessages = {
      draft: 'Quote marked as Draft',
      sent: 'Quote marked as Sent',
      approved: 'Quote marked as Approved',
      rejected: 'Quote marked as Rejected',
      changes_requested: 'Quote marked as Changes Requested'
    };
    
    toast({
      title: statusMessages[status],
      description: `Status updated successfully.`
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Sent</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Draft</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      case 'changes_requested':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">Changes Requested</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6 gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/quotes')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold flex-grow">{quote.title}</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/quotes/${quote.id}/edit`}>
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
                <DialogTitle>Delete Quote</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this quote? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteQuote}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Quote Details</CardTitle>
            <div className="flex items-center gap-2">
              <PenTool className="h-4 w-4 text-gray-500" />
              {getStatusBadge(quote.status)}
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Quote Number</dt>
                  <dd>Q-{quote.id.substring(0, 8).toUpperCase()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                  <dd>{formatDate(quote.createdAt)}</dd>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                  <dd>{formatDate(quote.validUntil)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="text-lg font-semibold">{formatCurrency(quote.total)}</dd>
                </div>
              </div>
              {quote.description && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="text-gray-700">{quote.description}</dd>
                </div>
              )}
            </dl>
            
            <h3 className="text-base font-medium mb-3">Quote Items</h3>
            <div className="rounded-md border overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-sm text-right font-medium">Subtotal</td>
                    <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(quote.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-sm text-right font-medium">Tax ({(quote.tax / quote.subtotal * 100).toFixed(2)}%)</td>
                    <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(quote.tax)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Total</td>
                    <td className="px-4 py-2 text-right font-bold">{formatCurrency(quote.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {quote.notes && (
              <div>
                <h3 className="text-base font-medium mb-2">Notes</h3>
                <div className="p-3 bg-gray-50 rounded-md text-sm">{quote.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              {client ? (
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </div>
                  <div className="text-sm">
                    <div>{client.phone}</div>
                    <div>{client.address}</div>
                    <div>{client.city}, {client.state} {client.zip}</div>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to={`/clients/${client.id}`}>View Client</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">Client information not available</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quote Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default" onClick={() => handleStatusChange('sent')} disabled={quote.status === 'sent'}>
                <Send className="h-4 w-4 mr-2" />
                Send Quote
              </Button>
              <Button className="w-full" variant="outline" onClick={() => handleStatusChange('approved')} disabled={quote.status === 'approved'}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Approved
              </Button>
              <Separator />
              <Button className="w-full" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetail;
