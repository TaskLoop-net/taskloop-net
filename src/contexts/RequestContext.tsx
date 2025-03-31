
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Request, NewRequest } from '../types/request';

interface RequestContextType {
  requests: Request[];
  addRequest: (request: NewRequest) => Request;
  getRequestById: (id: string) => Request | undefined;
  updateRequest: (id: string, request: Partial<Request>) => Request | undefined;
  deleteRequest: (id: string) => void;
}

const RequestContext = createContext<RequestContextType>({
  requests: [],
  addRequest: () => ({ 
    id: '', 
    title: '', 
    description: '', 
    clientId: '', 
    status: 'new', 
    propertyType: '',
    createdAt: new Date(), 
    updatedAt: new Date() 
  }),
  getRequestById: () => undefined,
  updateRequest: () => undefined,
  deleteRequest: () => {},
});

export const useRequests = () => useContext(RequestContext);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<Request[]>(() => {
    const savedRequests = localStorage.getItem('requests');
    if (savedRequests) {
      try {
        const parsedRequests = JSON.parse(savedRequests);
        return parsedRequests.map((request: any) => ({
          ...request,
          createdAt: new Date(request.createdAt),
          updatedAt: new Date(request.updatedAt),
        }));
      } catch (error) {
        console.error('Error parsing saved requests:', error);
        return [];
      }
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = (request: NewRequest): Request => {
    const newRequest: Request = {
      ...request,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setRequests(prevRequests => [...prevRequests, newRequest]);
    return newRequest;
  };

  const getRequestById = (id: string): Request | undefined => {
    return requests.find(request => request.id === id);
  };

  const updateRequest = (id: string, updatedData: Partial<Request>): Request | undefined => {
    let updatedRequest: Request | undefined;
    
    setRequests(prevRequests => {
      const updated = prevRequests.map(request => {
        if (request.id === id) {
          updatedRequest = {
            ...request,
            ...updatedData,
            updatedAt: new Date()
          };
          return updatedRequest;
        }
        return request;
      });
      return updated;
    });
    
    return updatedRequest;
  };

  const deleteRequest = (id: string): void => {
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
  };

  return (
    <RequestContext.Provider 
      value={{ 
        requests, 
        addRequest, 
        getRequestById, 
        updateRequest, 
        deleteRequest 
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
