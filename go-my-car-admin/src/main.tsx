// main.tsx
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ProgressBar from './components/progress-bar/index.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { SidebarProvider } from './context/sidebarContext.tsx';
import { ReactQueryProvider } from './providers/ReactQueryProvider.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { AuthProvider } from './context/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense>
        <ReactQueryProvider>
          <SidebarProvider>
            <ProgressBar />
            <App />
            <Toaster />
          </SidebarProvider>
        </ReactQueryProvider>
      </Suspense>
    </HelmetProvider>
  </StrictMode>
);
