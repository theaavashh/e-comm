import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { detectUserCountry, getCurrencyForCountry } from "@/utils/currency";

interface CurrencyContextType {
  selectedCurrency: string;
  selectedCountry: string;
  currencySymbol: string;
  setCurrency: (currency: string, country: string) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("NPR");
  const [selectedCountry, setSelectedCountry] = useState<string>("Nepal");
  const [currencySymbol, setCurrencySymbol] = useState<string>("NPR");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Currency symbols mapping
  const CURRENCY_SYMBOLS: Record<string, string> = {
    NPR: "NPR",
    USD: "$",
    AUD: "$",
    GBP: "£",
    CAD: "$",
    EUR: "€",
    INR: "₹",
    CNY: "¥",
    JPY: "¥",
    SGD: "$",
    AED: "د.إ",
  };

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        // Detect user's country
        const detectedCountry = await detectUserCountry();
        const detectedCurrency = getCurrencyForCountry(detectedCountry);
        const detectedSymbol =
          CURRENCY_SYMBOLS[detectedCurrency] || detectedCurrency;

        setSelectedCountry(detectedCountry);
        setSelectedCurrency(detectedCurrency);
        setCurrencySymbol(detectedSymbol);
      } catch (error) {
        console.error("Error detecting currency:", error);
        // Fallback to NPR
        setSelectedCountry("Nepal");
        setSelectedCurrency("NPR");
        setCurrencySymbol("NPR");
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  const setCurrency = (currency: string, country: string) => {
    setSelectedCurrency(currency);
    setSelectedCountry(country);
    setCurrencySymbol(CURRENCY_SYMBOLS[currency] || currency);
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    selectedCountry,
    currencySymbol,
    setCurrency,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
