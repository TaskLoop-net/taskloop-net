
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Clients from "./pages/Clients";
import NewClient from "./pages/NewClient";
import ClientDetail from "./pages/ClientDetail";
import EditClient from "./pages/EditClient";
import NotFound from "./pages/NotFound";
import { ClientProvider } from "./contexts/ClientContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClientProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <MainLayout>
                  <Schedule />
                </MainLayout>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <MainLayout>
                  <Clients />
                </MainLayout>
              } 
            />
            <Route 
              path="/clients/new" 
              element={
                <MainLayout>
                  <NewClient />
                </MainLayout>
              } 
            />
            <Route 
              path="/clients/:id" 
              element={
                <MainLayout>
                  <ClientDetail />
                </MainLayout>
              } 
            />
            <Route 
              path="/clients/:id/edit" 
              element={
                <MainLayout>
                  <EditClient />
                </MainLayout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ClientProvider>
  </QueryClientProvider>
);

export default App;
