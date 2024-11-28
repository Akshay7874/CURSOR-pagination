import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import VirtualTable from './components/VirtualTable'; // Import your VirtualTable component

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <VirtualTable /> {/* Your component using React Query hooks */}
      </div>
    </QueryClientProvider>
  );
}

export default App;
