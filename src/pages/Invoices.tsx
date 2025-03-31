
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  CircleDollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { useInvoices } from '@/contexts/InvoiceContext';
import { useClients } from '@/contexts/ClientContext';
import { InvoiceStatus } from '@/types/invoice';

const Invoices = () => {
  const { invoices } = useInvoices();
  const { getClientById } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate statistics
  const totalInvoices = invoices.length;
  const pastDue = invoices.filter((invoice) => invoice.status === 'past_due').length;
  
  const totalUnpaid = invoices
    .filter((invoice) => ['sent', 'past_due'].includes(invoice.status))
    .reduce((sum, invoice) => sum + invoice.total, 0);
    
  const pendingInvoices = invoices.filter((invoice) => 
    ['sent', 'past_due'].includes(invoice.status)
  ).length;

  // Filter invoices based on search
  const filteredInvoices = searchQuery
    ? invoices.filter(invoice => {
        const client = getClientById(invoice.clientId);
        const searchLower = searchQuery.toLowerCase();
        return (
          invoice.number.toLowerCase().includes(searchLower) ||
          (client && client.name.toLowerCase().includes(searchLower)) ||
          (invoice.subject && invoice.subject.toLowerCase().includes(searchLower))
        );
      })
    : invoices;

  // Get status badge styling
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
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage and track your invoices</p>
        </div>
        <Button asChild>
          <Link to="/invoices/new">
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">All invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Past Due</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">{pastDue}</div>
            <p className="text-xs text-muted-foreground mt-1">Overdue invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unpaid Amount</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">${totalUnpaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding balance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Manage your invoice records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Invoices</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                  <DropdownMenuItem>Sent</DropdownMenuItem>
                  <DropdownMenuItem>Paid</DropdownMenuItem>
                  <DropdownMenuItem>Past Due</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                  <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                  <DropdownMenuItem>Amount (High-Low)</DropdownMenuItem>
                  <DropdownMenuItem>Amount (Low-High)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first invoice'}
              </p>
              {!searchQuery && (
                <Button asChild className="mt-4">
                  <Link to="/invoices/new">
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => {
                    const client = getClientById(invoice.clientId);
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          <Link to={`/invoices/${invoice.id}`} className="hover:underline">
                            #{invoice.number}
                          </Link>
                        </TableCell>
                        <TableCell>{client ? client.name : 'Unknown Client'}</TableCell>
                        <TableCell>{format(new Date(invoice.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell>${invoice.total.toFixed(2)}</TableCell>
                        <TableCell>${invoice.balance.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-more-horizontal"
                                >
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="19" cy="12" r="1"></circle>
                                  <circle cx="5" cy="12" r="1"></circle>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/invoices/${invoice.id}`}>View Invoice</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/invoices/${invoice.id}/edit`}>Edit Invoice</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
