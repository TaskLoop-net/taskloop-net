
import React from 'react';
import { format } from 'date-fns';
import { Briefcase, FileText, Calendar, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

type ScheduleItem = {
  id: string;
  title: string;
  type: 'reminder' | 'job' | 'request' | 'task' | 'event';
  clientName?: string;
  date: Date;
  description?: string;
  status?: string;
  assignedTo?: string;
};

interface ListViewProps {
  items: ScheduleItem[];
}

const ListView = ({ items }: ListViewProps) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'job':
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'request':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'task':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Filtered schedule</h2>
      </div>

      <div className="bg-white rounded-md border">
        {items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {renderIcon(item.type)}
                      <div>
                        <div className="font-medium">{item.title}</div>
                        {item.clientName && <div className="text-sm text-gray-500">re: {item.clientName}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{format(item.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{item.assignedTo || 'Unassigned'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-20 text-center text-gray-500">
            No items found
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
