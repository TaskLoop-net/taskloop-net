
import React from 'react';
import { Button } from '@/components/ui/button';

interface InvoiceActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  invoiceId?: string;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ 
  onCancel, 
  isSubmitting,
  invoiceId
}) => {
  return (
    <div className="flex justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        className="mr-2"
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : invoiceId ? "Save Changes" : "Create Invoice"}
      </Button>
    </div>
  );
};

export default InvoiceActions;
