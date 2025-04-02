
import React from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceItem } from '@/types/invoice';

interface InvoiceItemsProps {
  invoiceItems: InvoiceItem[];
  updateInvoiceItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  removeInvoiceItem: (id: string) => void;
  addInvoiceItem: () => void;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  invoiceItems,
  updateInvoiceItem,
  removeInvoiceItem,
  addInvoiceItem,
  calculateSubtotal,
  calculateTax,
  calculateTotal
}) => {
  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Product / Service</h2>
        <div className="flex gap-2">
          <Button type="button" onClick={() => {}} variant="outline" size="sm" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Client view
            <Button variant="link" className="p-0 h-auto text-xs ml-1">Change</Button>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5 text-sm font-medium pl-2">Item</div>
          <div className="col-span-2 text-sm font-medium text-center">Qty.</div>
          <div className="col-span-2 text-sm font-medium text-right pr-4">Unit Price</div>
          <div className="col-span-3 text-sm font-medium text-right pr-2">Total</div>
        </div>
        
        {invoiceItems.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-start border rounded-md p-3">
            <div className="col-span-5">
              <Input
                value={item.name}
                onChange={(e) => updateInvoiceItem(item.id, 'name', e.target.value)}
                placeholder="Item name"
                className="mb-2"
              />
              <Textarea
                value={item.description || ''}
                onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                placeholder="Description"
                className="min-h-[60px] text-sm"
              />
              <div className="mt-2 flex justify-end">
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0 text-xs"
                  onClick={() => {
                    const now = new Date();
                    updateInvoiceItem(item.id, 'serviceDate', now);
                  }}
                >
                  Set Service Date
                </Button>
              </div>
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                min="1"
                step="1"
                className="text-center"
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center">
                <span className="mr-1">$</span>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="text-right"
                />
              </div>
            </div>
            <div className="col-span-2 pt-2 text-right pr-2">
              ${item.total.toFixed(2)}
            </div>
            <div className="col-span-1 flex justify-end">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeInvoiceItem(item.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button type="button" onClick={addInvoiceItem} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Line Item
        </Button>
        
        <InvoiceTotals 
          calculateSubtotal={calculateSubtotal} 
          calculateTax={calculateTax} 
          calculateTotal={calculateTotal}
        />
      </div>
    </div>
  );
};

interface InvoiceTotalsProps {
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ 
  calculateSubtotal, 
  calculateTax, 
  calculateTotal 
}) => {
  return (
    <div className="flex justify-end mt-4">
      <div className="w-64">
        <div className="flex justify-between px-4 py-2">
          <span>Subtotal:</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between px-4 py-2">
          <span>Discount:</span>
          <Button variant="link" className="h-auto p-0 text-sm">
            Add Discount
          </Button>
        </div>
        <div className="flex justify-between px-4 py-2">
          <span>Tax:</span>
          <Button variant="link" className="h-auto p-0 text-sm">
            Add Tax
          </Button>
        </div>
        <div className="flex justify-between px-4 py-2 font-medium border-t">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItems;
