
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Quote, NewQuote, QuoteItem } from '../types/quote';
import { useToast } from '@/hooks/use-toast';

interface QuoteContextProps {
  quotes: Quote[];
  addQuote: (quote: NewQuote) => Quote;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  getQuoteById: (id: string) => Quote | undefined;
  getQuotesByClientId: (clientId: string) => Quote[];
}

const QuoteContext = createContext<QuoteContextProps | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  // Initial sample data
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: '1',
      clientId: '1',
      title: 'Quarterly Maintenance',
      description: 'Regular maintenance service for property',
      items: [
        {
          id: '101',
          name: 'Basic maintenance',
          description: 'Includes inspection and routine maintenance',
          quantity: 1,
          unitPrice: 150
        },
        {
          id: '102',
          name: 'Filter replacement',
          description: 'Replace all filters',
          quantity: 3,
          unitPrice: 25
        }
      ],
      subtotal: 225,
      tax: 22.5,
      total: 247.5,
      status: 'approved',
      createdAt: new Date('2023-03-15'),
      validUntil: new Date('2023-04-15'),
      notes: 'Customer requested service to be done in the morning'
    },
    {
      id: '2',
      clientId: '3',
      title: 'Emergency Repair',
      description: 'Repair of broken system',
      items: [
        {
          id: '201',
          name: 'Emergency service',
          description: 'Same day service fee',
          quantity: 1,
          unitPrice: 200
        },
        {
          id: '202',
          name: 'Part replacement',
          description: 'Replace damaged component',
          quantity: 1,
          unitPrice: 350
        }
      ],
      subtotal: 550,
      tax: 55,
      total: 605,
      status: 'sent',
      createdAt: new Date('2023-03-20'),
      validUntil: new Date('2023-04-20'),
    },
    {
      id: '3',
      clientId: '2',
      title: 'System Upgrade',
      description: 'Upgrade existing system to newer model',
      items: [
        {
          id: '301',
          name: 'New system',
          description: 'Latest model with improved efficiency',
          quantity: 1,
          unitPrice: 1200
        },
        {
          id: '302',
          name: 'Installation',
          description: 'Professional installation service',
          quantity: 1,
          unitPrice: 450
        },
        {
          id: '303',
          name: 'Removal of old system',
          description: 'Safe removal and disposal of existing system',
          quantity: 1,
          unitPrice: 150
        }
      ],
      subtotal: 1800,
      tax: 180,
      total: 1980,
      status: 'draft',
      createdAt: new Date('2023-03-25'),
      validUntil: new Date('2023-04-25'),
      notes: 'Customer is considering financing options'
    }
  ]);

  const calculateTotals = (items: QuoteItem[], taxRate: number = 10) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const addQuote = (newQuote: NewQuote): Quote => {
    // Create items with IDs
    const items: QuoteItem[] = newQuote.items.map(item => ({
      ...item,
      id: uuidv4()
    }));
    
    // Calculate totals
    const taxRate = newQuote.tax !== undefined ? newQuote.tax : 10;
    const { subtotal, tax, total } = calculateTotals(items, taxRate);
    
    const quote: Quote = {
      id: uuidv4(),
      clientId: newQuote.clientId,
      title: newQuote.title,
      description: newQuote.description,
      items,
      subtotal,
      tax,
      total,
      status: 'draft',
      createdAt: new Date(),
      validUntil: newQuote.validUntil || new Date(new Date().setMonth(new Date().getMonth() + 1)),
      notes: newQuote.notes
    };

    setQuotes(prevQuotes => [...prevQuotes, quote]);
    
    toast({
      title: 'Quote Created',
      description: `${quote.title} has been created successfully.`
    });

    return quote;
  };

  const updateQuote = (id: string, updatedData: Partial<Quote>) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => {
        if (quote.id === id) {
          const updatedQuote = { ...quote, ...updatedData };
          
          // If items were updated, recalculate totals
          if (updatedData.items) {
            const taxRate = updatedData.tax !== undefined ? updatedData.tax : quote.tax / (quote.subtotal / 100);
            const { subtotal, tax, total } = calculateTotals(updatedQuote.items, taxRate);
            updatedQuote.subtotal = subtotal;
            updatedQuote.tax = tax;
            updatedQuote.total = total;
          }
          
          return updatedQuote;
        }
        return quote;
      })
    );
    
    toast({
      title: 'Quote Updated',
      description: 'Quote information has been updated successfully.'
    });
  };

  const deleteQuote = (id: string) => {
    const quote = quotes.find(q => q.id === id);
    setQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== id));
    
    if (quote) {
      toast({
        title: 'Quote Deleted',
        description: `${quote.title} has been removed.`,
        variant: 'destructive'
      });
    }
  };

  const getQuoteById = (id: string) => {
    return quotes.find(quote => quote.id === id);
  };

  const getQuotesByClientId = (clientId: string) => {
    return quotes.filter(quote => quote.clientId === clientId);
  };

  return (
    <QuoteContext.Provider value={{ 
      quotes, 
      addQuote, 
      updateQuote, 
      deleteQuote, 
      getQuoteById,
      getQuotesByClientId
    }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuotes = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuoteProvider');
  }
  return context;
};
