
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, NewInvoice, InvoiceStatus } from '@/types/invoice';

interface InvoiceContextType {
  invoices: Invoice[];
  getInvoiceById: (id: string) => Invoice | undefined;
  addInvoice: (invoice: NewInvoice) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  getNextInvoiceNumber: () => string;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      const parsed = JSON.parse(savedInvoices);
      // Convert date strings back to Date objects
      return parsed.map((invoice: any) => ({
        ...invoice,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        createdAt: new Date(invoice.createdAt),
        updatedAt: new Date(invoice.updatedAt),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  const addInvoice = (invoice: NewInvoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setInvoices([...invoices, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id
          ? { ...invoice, ...updates, updatedAt: new Date() }
          : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id
          ? { ...invoice, status, updatedAt: new Date() }
          : invoice
      )
    );
  };

  const getNextInvoiceNumber = () => {
    if (invoices.length === 0) {
      return '1001';
    }
    
    // Find the highest invoice number and increment it
    const numbers = invoices.map(invoice => {
      const numericPart = parseInt(invoice.number.replace(/\D/g, ''), 10);
      return isNaN(numericPart) ? 1000 : numericPart;
    });
    
    const highestNumber = Math.max(...numbers);
    return (highestNumber + 1).toString();
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        getInvoiceById,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        getNextInvoiceNumber
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
