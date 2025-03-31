
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  period?: string;
  isMonetary?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon,
  period = "Past 30 days",
  isMonetary = false
}: StatCardProps) => {
  return (
    <div className="card-stats">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {icon && <div className="text-taskloop-blue">{icon}</div>}
      </div>
      
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold">
          {isMonetary && '$'}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {change !== undefined && (
          <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </div>
        )}
      </div>
      
      {period && <div className="text-xs text-gray-500 mt-1">{period}</div>}
    </div>
  );
};

export default StatCard;
