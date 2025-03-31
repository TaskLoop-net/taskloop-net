
import React from 'react';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import WorkflowCard from '@/components/dashboard/WorkflowCard';
import TaskItem from '@/components/dashboard/TaskItem';
import StatCard from '@/components/dashboard/StatCard';
import AppointmentList from '@/components/dashboard/AppointmentList';
import { 
  FileText, 
  PenTool, 
  Briefcase, 
  DollarSign, 
  Users,
  Globe,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  // Dummy data
  const appointments = [
    {
      id: '1',
      clientName: 'Michael Jones',
      jobTitle: 'Quarterly Maintenance',
      time: '9:00 AM - 11:00 AM',
      address: '742 Evergreen Terrace, Los Angeles'
    },
    {
      id: '2',
      clientName: 'Rafael Honda',
      jobTitle: 'Emergency Repair',
      time: '1:30 PM - 3:00 PM',
      address: '123 Main St, Los Angeles'
    },
    {
      id: '3',
      clientName: 'Tiago Charbel',
      jobTitle: 'Initial Consultation',
      time: '4:00 PM - 5:00 PM',
      address: '456 Oak Ave, Los Angeles'
    }
  ];

  const todosItems = [
    {
      title: 'Create a client portal',
      description: 'Clients can approve quotes, review jobs, and pay all online',
      icon: <Users className="h-5 w-5 text-taskloop-blue" />
    },
    {
      title: 'Build your website',
      description: 'Get your business online in no time with a free TaskLoop website',
      icon: <Globe className="h-5 w-5 text-taskloop-blue" />
    }
  ];

  return (
    <div>
      <WelcomeSection userName="Alex" />
      
      <h2 className="text-xl font-semibold mb-4">Workflow</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <WorkflowCard
          title="Requests"
          icon={<FileText className="h-5 w-5" />}
          count={0}
          statusLabel="New"
          details={[
            { label: 'Assessments complete', count: 0 },
            { label: 'Overdue', count: 0 }
          ]}
          path="/requests"
        />
        
        <WorkflowCard
          title="Quotes"
          icon={<PenTool className="h-5 w-5" />}
          count={6}
          statusLabel="Approved"
          amount={33000}
          details={[
            { label: 'Draft', count: 0 },
            { label: 'Changes requested', count: 0 }
          ]}
          path="/quotes"
          color="bg-taskloop-darkblue"
        />
        
        <WorkflowCard
          title="Jobs"
          icon={<Briefcase className="h-5 w-5" />}
          count={0}
          statusLabel="Requires invoicing"
          details={[
            { label: 'Active', count: 0 },
            { label: 'Action required', count: 0 }
          ]}
          path="/jobs"
        />
        
        <WorkflowCard
          title="Invoices"
          icon={<DollarSign className="h-5 w-5" />}
          count={3}
          statusLabel="Awaiting payment"
          amount={14300}
          details={[
            { label: 'Draft', count: 0 },
            { label: 'Past due', count: 3 }
          ]}
          path="/invoices"
          color="bg-taskloop-green"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">To do</h2>
          <div className="space-y-3">
            {todosItems.map((item, index) => (
              <TaskItem
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Performance</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <h3 className="font-medium mb-3">Receivables</h3>
            <div className="text-2xl font-bold mb-1">$14,272</div>
            <p className="text-sm text-gray-600 mb-4">3 clients owe you</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Client</span>
                <span>Balance</span>
              </div>
              
              <div className="flex justify-between py-1 border-t">
                <span>Tiago Charbel</span>
                <span className="text-red-500">$11,500</span>
              </div>
              
              <div className="flex justify-between py-1 border-t">
                <span>Michael Jones</span>
                <span className="text-red-500">$1,922</span>
              </div>
              
              <div className="flex justify-between py-1 border-t">
                <span>Rafael Honda</span>
                <span className="text-red-500">$850</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Today's appointments</h2>
      <AppointmentList 
        title="March 31, 2023" 
        appointments={appointments} 
      />
    </div>
  );
};

export default Dashboard;
