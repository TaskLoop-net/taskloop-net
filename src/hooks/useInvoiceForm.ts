
import { useState } from 'react';
import { InvoiceItem } from '@/types/invoice';

export const useInvoiceForm = (initialItems: InvoiceItem[] = [], initialTax: number = 0) => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(initialItems);

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return initialTax;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return {
    invoiceItems,
    setInvoiceItems,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    calculateSubtotal,
    calculateTax,
    calculateTotal
  };
};
