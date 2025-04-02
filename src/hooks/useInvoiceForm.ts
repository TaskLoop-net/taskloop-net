
import { useState } from 'react';
import { InvoiceItem } from '@/types/invoice';

export const useInvoiceForm = (initialItems: InvoiceItem[] = [], initialTax: number = 0) => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(initialItems);
  const [discount, setDiscount] = useState<{ type: 'percentage' | 'fixed'; value: number } | undefined>(undefined);
  const [tax, setTax] = useState<number>(initialTax);

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

  const calculateDiscountAmount = () => {
    if (!discount) return 0;
    
    const subtotal = calculateSubtotal();
    if (discount.type === 'percentage') {
      return subtotal * (discount.value / 100);
    } else {
      return discount.value;
    }
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    return (subtotal - discountAmount) * (tax / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const taxAmount = calculateTax();
    
    return subtotal - discountAmount + taxAmount;
  };

  return {
    invoiceItems,
    setInvoiceItems,
    discount,
    setDiscount,
    tax,
    setTax,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    calculateSubtotal,
    calculateDiscountAmount,
    calculateTax,
    calculateTotal
  };
};
