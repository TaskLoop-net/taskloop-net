
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useJobs } from '@/contexts/JobContext';
import { useClients } from '@/contexts/ClientContext';
import { Card, CardContent } from '@/components/ui/card';
import { JobStatus } from '@/types/job';

const Jobs = () => {
  const { jobs } = useJobs();
  const { clients } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'scheduled':
        return <div className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-blue-500" /> <span className="text-blue-500">Scheduled</span></div>;
      case 'in_progress':
        return <div className="flex items-center"><Clock className="h-4 w-4 mr-1 text-amber-500" /> <span className="text-amber-500">In Progress</span></div>;
      case 'completed':
        return <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> <span className="text-green-500">Completed</span></div>;
      case 'cancelled':
        return <div className="flex items-center"><XCircle className="h-4 w-4 mr-1 text-red-500" /> <span className="text-red-500">Cancelled</span></div>;
      default:
        return <span>{status}</span>;
    }
  };

  const filteredJobs = jobs.filter((job) => {
    // Apply status filter
    if (statusFilter !== 'all' && job.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    const clientName = getClientName(job.clientId).toLowerCase();
    const jobTitle = job.title.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return clientName.includes(searchLower) || jobTitle.includes(searchLower);
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Briefcase className="h-6 w-6 mr-2" />
            Jobs
          </h1>
          <p className="text-muted-foreground">Manage and track your jobs</p>
        </div>
        <Button asChild>
          <Link to="/jobs/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as JobStatus | 'all')}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" className="w-full mb-2">
            <TabsList className="grid w-full md:w-auto md:grid-cols-4">
              <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>All</TabsTrigger>
              <TabsTrigger value="active" onClick={() => setStatusFilter('in_progress')}>Active</TabsTrigger>
              <TabsTrigger value="scheduled" onClick={() => setStatusFilter('scheduled')}>Scheduled</TabsTrigger>
              <TabsTrigger value="completed" onClick={() => setStatusFilter('completed')}>Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link to={`/jobs/${job.id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell>{getClientName(job.clientId)}</TableCell>
                  <TableCell>{format(new Date(job.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell className="text-right">${job.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Jobs;
