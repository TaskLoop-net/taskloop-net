
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Client, NewClient } from '../types/client';
import { useToast } from '@/hooks/use-toast';

interface ClientContextProps {
  clients: Client[];
  addClient: (client: NewClient) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  // Initial sample data, similar to what's in the Clients.tsx page
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Michael Jones',
      email: 'michael.jones@example.com',
      phone: '(310) 555-1234',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      balance: 1922,
      properties: 2,
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Rafael Honda',
      email: 'rafael.honda@example.com',
      phone: '(213) 555-5678',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90002',
      balance: 850,
      properties: 1,
      createdAt: new Date('2023-02-20')
    },
    {
      id: '3',
      name: 'Tiago Charbel',
      email: 'tiago.charbel@example.com',
      phone: '(323) 555-9012',
      address: '789 Pine St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90003',
      balance: 11500,
      properties: 3,
      createdAt: new Date('2023-03-10')
    },
    {
      id: '4',
      name: 'Neena Tikoo',
      email: 'neena.tikoo@example.com',
      phone: '(424) 555-3456',
      address: '101 Maple Dr',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90004',
      balance: 0,
      properties: 1,
      createdAt: new Date('2023-04-05')
    },
  ]);

  const addClient = (newClient: NewClient): Client => {
    const client: Client = {
      id: uuidv4(),
      ...newClient,
      balance: 0,
      properties: 0,
      createdAt: new Date()
    };

    setClients(prevClients => [...prevClients, client]);
    toast({
      title: 'Client Created',
      description: `${client.name} has been added successfully.`
    });

    return client;
  };

  const updateClient = (id: string, updatedData: Partial<Client>) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === id ? { ...client, ...updatedData } : client
      )
    );
    
    toast({
      title: 'Client Updated',
      description: 'Client information has been updated successfully.'
    });
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prevClients => prevClients.filter(client => client.id !== id));
    
    if (client) {
      toast({
        title: 'Client Deleted',
        description: `${client.name} has been removed.`,
        variant: 'destructive'
      });
    }
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  return (
    <ClientContext.Provider value={{ 
      clients, 
      addClient, 
      updateClient, 
      deleteClient, 
      getClientById 
    }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};
