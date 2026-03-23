import React, { createContext, useContext, useState, useEffect } from 'react';

interface ExchangeRateContextType {
  usdToCdfRate: number;
  setUsdToCdfRate: (rate: number) => void;
  updateExchangeRate: (rate: number) => void;
  isLoading: boolean;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

const DEFAULT_RATE = 2850; // Average rate for CDF/USD
const LOCAL_STORAGE_KEY = 'exchange_rate_usd_cdf';

export const ExchangeRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usdToCdfRate, setUsdToCdfRateState] = useState<number>(DEFAULT_RATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const savedRate = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedRate) {
      setUsdToCdfRateState(parseFloat(savedRate));
    }
    setIsLoading(false);
  }, []);

  const setUsdToCdfRate = (rate: number) => {
    setUsdToCdfRateState(rate);
    localStorage.setItem(LOCAL_STORAGE_KEY, rate.toString());
  };

  const updateExchangeRate = (rate: number) => {
    setUsdToCdfRate(rate);
  };

  return (
    <ExchangeRateContext.Provider value={{ usdToCdfRate, setUsdToCdfRate, updateExchangeRate, isLoading }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
  }
  return context;
};