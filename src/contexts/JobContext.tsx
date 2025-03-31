
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Job, NewJob, LineItem } from '../types/job';

interface JobContextType {
  jobs: Job[];
  addJob: (job: NewJob) => Job;
  getJobById: (id: string) => Job | undefined;
  updateJob: (id: string, job: Partial<Job>) => Job | undefined;
  deleteJob: (id: string) => void;
  addLineItem: (jobId: string, lineItem: Omit<LineItem, 'id'>) => LineItem | undefined;
  updateLineItem: (jobId: string, lineItemId: string, lineItem: Partial<LineItem>) => LineItem | undefined;
  deleteLineItem: (jobId: string, lineItemId: string) => void;
}

const JobContext = createContext<JobContextType>({
  jobs: [],
  addJob: () => ({
    id: '',
    title: '',
    description: '',
    clientId: '',
    status: 'scheduled',
    type: 'one_off',
    startDate: new Date(),
    teamMembers: [],
    lineItems: [],
    invoiceOnCompletion: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    totalPrice: 0
  }),
  getJobById: () => undefined,
  updateJob: () => undefined,
  deleteJob: () => {},
  addLineItem: () => undefined,
  updateLineItem: () => undefined,
  deleteLineItem: () => {}
});

export const useJobs = () => useContext(JobContext);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        return parsedJobs.map((job: any) => ({
          ...job,
          startDate: new Date(job.startDate),
          endDate: job.endDate ? new Date(job.endDate) : undefined,
          createdAt: new Date(job.createdAt),
          updatedAt: new Date(job.updatedAt),
        }));
      } catch (error) {
        console.error('Error parsing saved jobs:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const calculateTotal = (lineItems: LineItem[]): number => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const addJob = (job: NewJob): Job => {
    const newJob: Job = {
      ...job,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPrice: calculateTotal(job.lineItems)
    };

    setJobs(prevJobs => [...prevJobs, newJob]);
    return newJob;
  };

  const getJobById = (id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  };

  const updateJob = (id: string, updatedData: Partial<Job>): Job | undefined => {
    let updatedJob: Job | undefined;

    setJobs(prevJobs => {
      const updated = prevJobs.map(job => {
        if (job.id === id) {
          updatedJob = {
            ...job,
            ...updatedData,
            updatedAt: new Date(),
            totalPrice: updatedData.lineItems ? calculateTotal(updatedData.lineItems) : job.totalPrice
          };
          return updatedJob;
        }
        return job;
      });
      return updated;
    });

    return updatedJob;
  };

  const deleteJob = (id: string): void => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
  };

  const addLineItem = (jobId: string, lineItemData: Omit<LineItem, 'id'>): LineItem | undefined => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return undefined;

    const newLineItem: LineItem = {
      ...lineItemData,
      id: uuidv4()
    };

    const updatedLineItems = [...job.lineItems, newLineItem];
    
    updateJob(jobId, { 
      lineItems: updatedLineItems,
      totalPrice: calculateTotal(updatedLineItems)
    });

    return newLineItem;
  };

  const updateLineItem = (jobId: string, lineItemId: string, lineItemData: Partial<LineItem>): LineItem | undefined => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return undefined;

    let updatedLineItem: LineItem | undefined;
    const updatedLineItems = job.lineItems.map(item => {
      if (item.id === lineItemId) {
        updatedLineItem = { ...item, ...lineItemData };
        if (lineItemData.quantity !== undefined || lineItemData.unitPrice !== undefined) {
          const quantity = lineItemData.quantity ?? item.quantity;
          const unitPrice = lineItemData.unitPrice ?? item.unitPrice;
          updatedLineItem.total = quantity * unitPrice;
        }
        return updatedLineItem;
      }
      return item;
    });

    updateJob(jobId, { 
      lineItems: updatedLineItems,
      totalPrice: calculateTotal(updatedLineItems)
    });

    return updatedLineItem;
  };

  const deleteLineItem = (jobId: string, lineItemId: string): void => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const updatedLineItems = job.lineItems.filter(item => item.id !== lineItemId);
    
    updateJob(jobId, { 
      lineItems: updatedLineItems,
      totalPrice: calculateTotal(updatedLineItems)
    });
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        addJob,
        getJobById,
        updateJob,
        deleteJob,
        addLineItem,
        updateLineItem,
        deleteLineItem
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
