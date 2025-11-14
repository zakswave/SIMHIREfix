import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { UserProvider } from './context/UserContext';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { initializeSampleData } from './lib/portfolio';
import { initializeSampleApplications } from './lib/storage';
import { initializeCompanyData } from './lib/company/data';
import './index.css';
initializeSampleData();
initializeSampleApplications();
initializeCompanyData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <App />
          <Toaster richColors position="bottom-right" />
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
