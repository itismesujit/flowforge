import { Provider } from "@/components/ui/provider"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import { Toaster } from './components/ui/toaster'
import './index.css'
import App from './App.tsx'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <Provider>
          <App />
          <Toaster />
        </Provider>
      </ReduxProvider>
    </QueryClientProvider>
  </StrictMode>,
)
