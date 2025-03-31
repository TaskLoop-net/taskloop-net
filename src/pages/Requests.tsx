
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  ArrowUpDown, 
  Search,
  ArrowRight
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
import { useRequests } from '@/contexts/RequestContext';
import { useClients } from '@/contexts/ClientContext';

const Requests = () => {
  const { requests } = useRequests();
  const { clients, getClientById } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get counts by status
  const newCount = requests.filter(req => req.status === 'new').length;
  const assessmentCompleteCount = requests.filter(req => req.status === 'assessment_complete').length;
  const overdueCount = requests.filter(req => req.status === 'overdue').length;
  const unscheduledCount = requests.filter(req => req.status === 'unscheduled').length;
  
  // Calculate past 30 days stats
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newRequestsLast30Days = requests.filter(
    req => new Date(req.createdAt) >= thirtyDaysAgo
  ).length;
  
  // Filter requests based on search query
  const filteredRequests = requests.filter(request => {
    const client = getClientById(request.clientId);
    const clientName = client?.name.toLowerCase() || '';
    const requestTitle = request.title.toLowerCase();
    const requestDescription = request.description.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return clientName.includes(query) || 
           requestTitle.includes(query) || 
           requestDescription.includes(query);
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case 'assessment_complete':
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
      case 'overdue':
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
      case 'unscheduled':
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500"></div>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date instanceof Date ? date : new Date(date));
  };

  const statusToDisplayText = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'assessment_complete':
        return 'Assessment Complete';
      case 'overdue':
        return 'Overdue';
      case 'unscheduled':
        return 'Unscheduled';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-muted-foreground">Manage client requests and track status</p>
        </div>
        <Button asChild>
          <Link to="/requests/new">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>New ({newCount})</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Assessment complete ({assessmentCompleteCount})</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Overdue ({overdueCount})</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Unscheduled ({unscheduledCount})</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              <span>New requests</span>
              <ArrowRight className="h-4 w-4" />
            </CardTitle>
            <p className="text-xs text-muted-foreground">Past 30 days</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{newRequestsLast30Days}</span>
              <span className="ml-2 text-md">{newRequestsLast30Days === 0 ? '0%' : '0%'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Conversion rate</CardTitle>
            <p className="text-xs text-muted-foreground">Past 30 days</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">0%</span>
              <span className="ml-2 text-md">0%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            All requests {filteredRequests.length > 0 ? `(${filteredRequests.length} results)` : '(0 results)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search requests..."
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
                <DropdownMenuItem onClick={() => setSearchQuery('')}>All Requests</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('new')}>New</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('assessment')}>Assessment Complete</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('overdue')}>Overdue</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchQuery('unscheduled')}>Unscheduled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-muted-foreground">Let's create a request and track incoming work</p>
                        <Button asChild variant="outline">
                          <Link to="/requests/new">New Request</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => {
                    const client = getClientById(request.clientId);
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            <span>{statusToDisplayText(request.status)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {client ? client.name : 'Unknown Client'}
                        </TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.propertyType}</TableCell>
                        <TableCell>
                          {client ? client.email : 'Unknown'}
                        </TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Link
                            to={`/requests/${request.id}`}
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

export default Requests;
