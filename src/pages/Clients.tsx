
import React, { useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientContext';

const Clients = () => {
  const { clients } = useClients();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-taskloop-gray mr-2" />
          <h1 className="text-2xl font-bold">Clients</h1>
        </div>
        <Button 
          className="bg-taskloop-gray hover:bg-taskloop-darkgray"
          onClick={() => navigate('/clients/new')}
        >
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    {searchTerm ? 'No clients found matching your search' : 'No clients yet'}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
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
                      {client.address}, {client.city}, {client.state} {client.zip}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;
