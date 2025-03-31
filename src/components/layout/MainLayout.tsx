
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-taskloop-lightgray">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
