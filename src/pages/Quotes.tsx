
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PenTool, 
  Plus, 
  ArrowUpDown, 
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useQuotes } from '@/contexts/QuoteContext';
import { useClients } from '@/contexts/ClientContext';

const Quotes = () => {
  const { quotes } = useQuotes();
  const { clients, getClientById } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredQuotes = quotes.filter(quote => {
    const client = getClientById(quote.clientId);
    const clientName = client?.name.toLowerCase() || '';
    const quoteTitle = quote.title.toLowerCase();
    const quoteDescription = quote.description?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return clientName.includes(query) || 
           quoteTitle.includes(query) || 
           quoteDescription.includes(query);
  });
  
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'draft':
        return <PenTool className="h-4 w-4 text-gray-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'changes_requested':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="text-muted-foreground">Create and manage client quotes</p>
        </div>
        <Button asChild>
          <Link to="/quotes/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Quote
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <PenTool className="h-5 w-5 mr-2" />
            Quote Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search quotes by title, client name, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchQuery('')}>All Quotes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('draft')}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('sent')}>Sent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('approved')}>Approved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No quotes found. Create your first quote!
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotes.map((quote) => {
                    const client = getClientById(quote.clientId);
                    return (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <div className="font-medium">{quote.title}</div>
                          <div className="text-sm text-muted-foreground">{quote.description}</div>
                        </TableCell>
                        <TableCell>
                          {client ? client.name : 'Unknown Client'}
                        </TableCell>
                        <TableCell>{formatDate(quote.createdAt)}</TableCell>
                        <TableCell>{formatCurrency(quote.total)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(quote.status)}
                            {getStatusBadge(quote.status)}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(quote.validUntil)}</TableCell>
                        <TableCell className="text-right">
                          <Link
                            to={`/quotes/${quote.id}`}
                            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quotes;
