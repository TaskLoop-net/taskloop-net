
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
import Quotes from "./pages/Quotes";
import NewQuote from "./pages/NewQuote";
import QuoteDetail from "./pages/QuoteDetail";
import EditQuote from "./pages/EditQuote";
import Requests from "./pages/Requests";
import NewRequest from "./pages/NewRequest";
import RequestDetail from "./pages/RequestDetail";
import EditRequest from "./pages/EditRequest";
import Jobs from "./pages/Jobs";
import NewJob from "./pages/NewJob";
import JobDetail from "./pages/JobDetail";
import EditJob from "./pages/EditJob";
import NotFound from "./pages/NotFound";
import { ClientProvider } from "./contexts/ClientContext";
import { QuoteProvider } from "./contexts/QuoteContext";
import { RequestProvider } from "./contexts/RequestContext";
import { JobProvider } from "./contexts/JobContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClientProvider>
      <QuoteProvider>
        <RequestProvider>
          <JobProvider>
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
                  <Route 
                    path="/requests" 
                    element={
                      <MainLayout>
                        <Requests />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/requests/new" 
                    element={
                      <MainLayout>
                        <NewRequest />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/requests/:id" 
                    element={
                      <MainLayout>
                        <RequestDetail />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/requests/:id/edit" 
                    element={
                      <MainLayout>
                        <EditRequest />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/jobs" 
                    element={
                      <MainLayout>
                        <Jobs />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/jobs/new" 
                    element={
                      <MainLayout>
                        <NewJob />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/jobs/:id" 
                    element={
                      <MainLayout>
                        <JobDetail />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/jobs/:id/edit" 
                    element={
                      <MainLayout>
                        <EditJob />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/quotes" 
                    element={
                      <MainLayout>
                        <Quotes />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/quotes/new" 
                    element={
                      <MainLayout>
                        <NewQuote />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/quotes/:id" 
                    element={
                      <MainLayout>
                        <QuoteDetail />
                      </MainLayout>
                    } 
                  />
                  <Route 
                    path="/quotes/:id/edit" 
                    element={
                      <MainLayout>
                        <EditQuote />
                      </MainLayout>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </JobProvider>
        </RequestProvider>
      </QuoteProvider>
    </ClientProvider>
  </QueryClientProvider>
);

export default App;
