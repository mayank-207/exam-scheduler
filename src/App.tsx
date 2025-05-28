import React from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Layout />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;