'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  selectedCountry: string;
  selectedCity: string;
  setSelectedCountry: (country: string) => void;
  setSelectedCity: (city: string) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedCountry, setSelectedCountryState] = useState<string>('Nepal');
  const [selectedCity, setSelectedCityState] = useState<string>('Kathmandu');
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCountry = localStorage.getItem('userCountry');
      const storedCity = localStorage.getItem('userCity');
      
      if (storedCountry) {
        setSelectedCountryState(storedCountry);
      }
      if (storedCity) {
        setSelectedCityState(storedCity);
      }
      
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever country changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedCountry) {
      localStorage.setItem('userCountry', selectedCountry);
    }
  }, [selectedCountry]);

  // Save to localStorage whenever city changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedCity) {
      localStorage.setItem('userCity', selectedCity);
    }
  }, [selectedCity]);

  const setSelectedCountry = (country: string) => {
    setSelectedCountryState(country);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCountry', country);
    }
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCity', city);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        selectedCountry,
        selectedCity,
        setSelectedCountry,
        setSelectedCity,
        isLoading,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

