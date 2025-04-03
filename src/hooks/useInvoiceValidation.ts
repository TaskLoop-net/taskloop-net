
import { InvoiceItem } from '@/types/invoice';
import { useToast } from '@/hooks/use-toast';

export const useInvoiceValidation = () => {
  const { toast } = useToast();

  /**
   * Validates if invoice items have been added to the invoice
   * @param invoiceItems The list of invoice items to validate
   * @returns Boolean indicating if the validation passed
   */
  const validateInvoiceItems = (invoiceItems: InvoiceItem[]): boolean => {
    if (invoiceItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to the invoice.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  /**
   * Validates if all invoice items have a name
   * @param invoiceItems The list of invoice items to validate
   * @returns Boolean indicating if the validation passed
   */
  const validateInvoiceItemNames = (invoiceItems: InvoiceItem[]): boolean => {
    if (invoiceItems.some(item => !item.name)) {
      toast({
        title: "Incomplete items",
        description: "All invoice items must have a name.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  /**
   * Performs all invoice validations
   * @param invoiceItems The list of invoice items to validate
   * @returns Boolean indicating if all validations passed
   */
  const validateInvoice = (invoiceItems: InvoiceItem[]): boolean => {
    return validateInvoiceItems(invoiceItems) && validateInvoiceItemNames(invoiceItems);
  };

  return {
    validateInvoice,
    validateInvoiceItems,
    validateInvoiceItemNames
  };
};
