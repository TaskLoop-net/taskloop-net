
import React from 'react';
import { Link } from 'react-router-dom';

interface WorkflowCardProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  statusLabel: string;
  amount?: number;
  details: { label: string; count: number }[];
  path: string;
  color?: string;
}

const WorkflowCard = ({ 
  title, 
  icon, 
  count, 
  statusLabel, 
  amount, 
  details, 
  path,
  color = 'bg-taskloop-gray' 
}: WorkflowCardProps) => {
  return (
    <Link to={path} className="workflow-card block">
      <div className="flex items-center gap-3 mb-3 text-gray-700">
        <div className={`${color} text-white rounded-md p-2`}>
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold">{count}</span>
          {amount && <span className="text-gray-600 text-sm">${amount.toLocaleString()}</span>}
        </div>
        <span className="text-sm text-gray-600">{statusLabel}</span>
      </div>
      
      <div className="mt-4 space-y-1.5 pt-3 border-t">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{detail.label}</span>
            <span className="font-medium">{detail.count}</span>
          </div>
        ))}
      </div>
    </Link>
  );
};

export default WorkflowCard;
