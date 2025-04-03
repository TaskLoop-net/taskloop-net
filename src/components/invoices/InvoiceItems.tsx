
import React, { useState } from 'react';
import { Plus, Trash2, Eye, Percent, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceItem } from '@/types/invoice';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface InvoiceItemsProps {
  invoiceItems: InvoiceItem[];
  updateInvoiceItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  removeInvoiceItem: (id: string) => void;
  addInvoiceItem: () => void;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  setDiscount?: (discount: { type: 'percentage' | 'fixed'; value: number } | undefined) => void;
  tax?: number;
  setTax?: (tax: number) => void;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  invoiceItems,
  updateInvoiceItem,
  removeInvoiceItem,
  addInvoiceItem,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  discount,
  setDiscount,
  tax,
  setTax
}) => {
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isTaxDialogOpen, setIsTaxDialogOpen] = useState(false);
  
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    discount?.type || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState<number>(
    discount?.value || 0
  );
  
  const [taxRate, setTaxRate] = useState<number>(tax || 0);
  
  const handleApplyDiscount = () => {
    if (setDiscount) {
      setDiscount({
        type: discountType,
        value: discountValue
      });
    }
    setIsDiscountDialogOpen(false);
  };
  
  const handleRemoveDiscount = () => {
    if (setDiscount) {
      setDiscount(undefined);
    }
    setDiscountValue(0);
    setIsDiscountDialogOpen(false);
  };
  
  const handleApplyTax = () => {
    if (setTax) {
      setTax(taxRate);
    }
    setIsTaxDialogOpen(false);
  };
  
  const handleRemoveTax = () => {
    if (setTax) {
      setTax(0);
    }
    setTaxRate(0);
    setIsTaxDialogOpen(false);
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
          discount={discount}
          calculateDiscountAmount={calculateDiscountAmount}
          onAddDiscountClick={() => setIsDiscountDialogOpen(true)}
          onAddTaxClick={() => setIsTaxDialogOpen(true)}
        />
      </div>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Discount</DialogTitle>
            <DialogDescription>
              Apply a discount to this invoice
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <RadioGroup 
              value={discountType} 
              onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}
              className="space-y-2"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="percentage" />
                </FormControl>
                <FormLabel className="font-normal">Percentage (%)</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="fixed" />
                </FormControl>
                <FormLabel className="font-normal">Fixed Amount ($)</FormLabel>
              </FormItem>
            </RadioGroup>
            
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
              </Label>
              <div className="flex items-center">
                {discountType === 'percentage' ? (
                  <>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      max={discountType === 'percentage' ? '100' : undefined}
                      step="0.01"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                    />
                    <span className="ml-2">%</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">$</span>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="space-x-2">
            {discount && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRemoveDiscount}
              >
                Remove Discount
              </Button>
            )}
            <Button 
              type="button" 
              onClick={handleApplyDiscount}
            >
              Apply Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tax Dialog */}
      <Dialog open={isTaxDialogOpen} onOpenChange={setIsTaxDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tax</DialogTitle>
            <DialogDescription>
              Apply tax to this invoice
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <div className="flex items-center">
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="space-x-2">
            {tax && tax > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRemoveTax}
              >
                Remove Tax
              </Button>
            )}
            <Button 
              type="button" 
              onClick={handleApplyTax}
            >
              Apply Tax
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface InvoiceTotalsProps {
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  calculateDiscountAmount: () => number;
  onAddDiscountClick: () => void;
  onAddTaxClick: () => void;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ 
  calculateSubtotal, 
  calculateTax, 
  calculateTotal,
  discount,
  calculateDiscountAmount,
  onAddDiscountClick,
  onAddTaxClick
}) => {
  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscountAmount();
  const taxAmount = calculateTax();
  const total = calculateTotal();
  
  return (
    <div className="flex justify-end mt-4">
      <div className="w-64">
        <div className="flex justify-between px-4 py-2">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between px-4 py-2">
          <span>Discount:</span>
          {discount ? (
            <span className="text-green-600">-${discountAmount.toFixed(2)}</span>
          ) : (
            <Button variant="link" className="h-auto p-0 text-sm" onClick={onAddDiscountClick}>
              Add Discount
            </Button>
          )}
        </div>
        <div className="flex justify-between px-4 py-2">
          <span>Tax:</span>
          {taxAmount > 0 ? (
            <span>${taxAmount.toFixed(2)}</span>
          ) : (
            <Button variant="link" className="h-auto p-0 text-sm" onClick={onAddTaxClick}>
              Add Tax
            </Button>
          )}
        </div>
        <div className="flex justify-between px-4 py-2 font-medium border-t">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItems;
