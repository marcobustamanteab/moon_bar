import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface LoadingContextType {
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  setLoading: () => {}
});

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {loading && <LoadingSpinner />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe ser usado dentro de un LoadingProvider');
  }
  return context;
};