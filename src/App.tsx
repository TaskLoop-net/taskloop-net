
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
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="schedule" element={<Schedule />} />
                    
                    <Route path="clients">
                      <Route index element={<Clients />} />
                      <Route path=":id" element={<ClientDetail />} />
                      <Route path="new" element={<NewClient />} />
                      <Route path=":id/edit" element={<EditClient />} />
                    </Route>
                    
                    <Route path="requests">
                      <Route index element={<Requests />} />
                      <Route path=":id" element={<RequestDetail />} />
                      <Route path="new" element={<NewRequest />} />
                      <Route path=":id/edit" element={<EditRequest />} />
                    </Route>
                    
                    <Route path="quotes">
                      <Route index element={<Quotes />} />
                      <Route path=":id" element={<QuoteDetail />} />
                      <Route path="new" element={<NewQuote />} />
                      <Route path=":id/edit" element={<EditQuote />} />
                    </Route>
                    
                    <Route path="jobs">
                      <Route index element={<Jobs />} />
                      <Route path=":id" element={<JobDetail />} />
                      <Route path="new" element={<NewJob />} />
                      <Route path=":id/edit" element={<EditJob />} />
                    </Route>
                    
                    <Route path="invoices">
                      <Route index element={<Invoices />} />
                      <Route path=":id" element={<InvoiceDetail />} />
                      <Route path="new" element={<NewInvoice />} />
                      <Route path=":id/edit" element={<EditInvoice />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Route>
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
