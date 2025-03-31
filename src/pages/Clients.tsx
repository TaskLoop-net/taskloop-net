
import React from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  properties: number;
}

const Clients = () => {
  // Sample client data
  const clients: Client[] = [
    {
      id: '1',
      name: 'Michael Jones',
      email: 'michael.jones@example.com',
      phone: '(310) 555-1234',
      address: '123 Main St, Los Angeles, CA',
      balance: 1922,
      properties: 2
    },
    {
      id: '2',
      name: 'Rafael Honda',
      email: 'rafael.honda@example.com',
      phone: '(213) 555-5678',
      address: '456 Oak Ave, Los Angeles, CA',
      balance: 850,
      properties: 1
    },
    {
      id: '3',
      name: 'Tiago Charbel',
      email: 'tiago.charbel@example.com',
      phone: '(323) 555-9012',
      address: '789 Pine St, Los Angeles, CA',
      balance: 11500,
      properties: 3
    },
    {
      id: '4',
      name: 'Neena Tikoo',
      email: 'neena.tikoo@example.com',
      phone: '(424) 555-3456',
      address: '101 Maple Dr, Los Angeles, CA',
      balance: 0,
      properties: 1
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-taskloop-blue mr-2" />
          <h1 className="text-2xl font-bold">Clients</h1>
        </div>
        <Button className="bg-taskloop-blue hover:bg-taskloop-darkblue">
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10" 
              placeholder="Search clients..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Client</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Email</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Phone</th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">Address</th>
                <th className="px-4 py-3 text-right text-gray-700 font-medium">Balance</th>
                <th className="px-4 py-3 text-center text-gray-700 font-medium">Properties</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.address}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className={`${client.balance > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      ${client.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {client.properties}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/clients/${client.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;
