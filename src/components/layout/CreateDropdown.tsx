
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, User, FileText, PenTool, Briefcase, Receipt } from 'lucide-react';

interface CreateDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDropdown: React.FC<CreateDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const createOptions = [
    { name: 'Client', icon: <User className="h-6 w-6" />, path: '/clients/new' },
    { name: 'Request', icon: <FileText className="h-6 w-6" />, path: '/requests/new' },
    { name: 'Quote', icon: <PenTool className="h-6 w-6" />, path: '/quotes/new' },
    { name: 'Job', icon: <Briefcase className="h-6 w-6" />, path: '/jobs/new' },
    { name: 'Invoice', icon: <Receipt className="h-6 w-6" />, path: '/invoices/new' },
  ];

  return (
    <div 
      ref={dropdownRef} 
      className="absolute left-full ml-2 top-0 z-50 bg-white rounded-lg shadow-lg p-4 w-[360px] border border-gray-200 create-dropdown"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Create</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {createOptions.map((option) => (
          <Link
            key={option.name}
            to={option.path}
            onClick={onClose}
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
          >
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-taskloop-gray mb-2">
              {option.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{option.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CreateDropdown;
