
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import NewClient from "./pages/NewClient";
import EditClient from "./pages/EditClient";

import Schedule from "./pages/Schedule";

import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import NewRequest from "./pages/NewRequest";
import EditRequest from "./pages/EditRequest";

import Quotes from "./pages/Quotes";
import QuoteDetail from "./pages/QuoteDetail";
import NewQuote from "./pages/NewQuote";
import EditQuote from "./pages/EditQuote";

import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import NewJob from "./pages/NewJob";
import EditJob from "./pages/EditJob";

import Invoices from "./pages/Invoices";
import InvoiceDetail from "./pages/InvoiceDetail";
import NewInvoice from "./pages/NewInvoice";
import EditInvoice from "./pages/EditInvoice";

import NotFound from "./pages/NotFound";

import MainLayout from "./components/layout/MainLayout";

import { ClientProvider } from "./contexts/ClientContext";
import { RequestProvider } from "./contexts/RequestContext";
import { QuoteProvider } from "./contexts/QuoteContext";
import { JobProvider } from "./contexts/JobContext";
import { InvoiceProvider } from "./contexts/InvoiceContext";

import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <ClientProvider>
        <RequestProvider>
          <QuoteProvider>
            <JobProvider>
              <InvoiceProvider>
                <Routes>
                  <Route path="/" element={
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  } />
                  <Route path="/schedule" element={
                    <MainLayout>
                      <Schedule />
                    </MainLayout>
                  } />
                  
                  <Route path="/clients" element={
                    <MainLayout>
                      <Clients />
                    </MainLayout>
                  } />
                  <Route path="/clients/:id" element={
                    <MainLayout>
                      <ClientDetail />
                    </MainLayout>
                  } />
                  <Route path="/clients/new" element={
                    <MainLayout>
                      <NewClient />
                    </MainLayout>
                  } />
                  <Route path="/clients/:id/edit" element={
                    <MainLayout>
                      <EditClient />
                    </MainLayout>
                  } />
                  
                  <Route path="/requests" element={
                    <MainLayout>
                      <Requests />
                    </MainLayout>
                  } />
                  <Route path="/requests/:id" element={
                    <MainLayout>
                      <RequestDetail />
                    </MainLayout>
                  } />
                  <Route path="/requests/new" element={
                    <MainLayout>
                      <NewRequest />
                    </MainLayout>
                  } />
                  <Route path="/requests/:id/edit" element={
                    <MainLayout>
                      <EditRequest />
                    </MainLayout>
                  } />
                  
                  <Route path="/quotes" element={
                    <MainLayout>
                      <Quotes />
                    </MainLayout>
                  } />
                  <Route path="/quotes/:id" element={
                    <MainLayout>
                      <QuoteDetail />
                    </MainLayout>
                  } />
                  <Route path="/quotes/new" element={
                    <MainLayout>
                      <NewQuote />
                    </MainLayout>
                  } />
                  <Route path="/quotes/:id/edit" element={
                    <MainLayout>
                      <EditQuote />
                    </MainLayout>
                  } />
                  
                  <Route path="/jobs" element={
                    <MainLayout>
                      <Jobs />
                    </MainLayout>
                  } />
                  <Route path="/jobs/:id" element={
                    <MainLayout>
                      <JobDetail />
                    </MainLayout>
                  } />
                  <Route path="/jobs/new" element={
                    <MainLayout>
                      <NewJob />
                    </MainLayout>
                  } />
                  <Route path="/jobs/:id/edit" element={
                    <MainLayout>
                      <EditJob />
                    </MainLayout>
                  } />
                  
                  <Route path="/invoices" element={
                    <MainLayout>
                      <Invoices />
                    </MainLayout>
                  } />
                  <Route path="/invoices/:id" element={
                    <MainLayout>
                      <InvoiceDetail />
                    </MainLayout>
                  } />
                  <Route path="/invoices/new" element={
                    <MainLayout>
                      <NewInvoice />
                    </MainLayout>
                  } />
                  <Route path="/invoices/:id/edit" element={
                    <MainLayout>
                      <EditInvoice />
                    </MainLayout>
                  } />
                  
                  <Route path="*" element={
                    <MainLayout>
                      <NotFound />
                    </MainLayout>
                  } />
                </Routes>
                <Toaster />
              </InvoiceProvider>
            </JobProvider>
          </QuoteProvider>
        </RequestProvider>
      </ClientProvider>
    </Router>
  );
}

export default App;
