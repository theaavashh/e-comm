import React from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CurrencySelectorProps {
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = "",
}) => {
  const { selectedCurrency, setCurrency, isLoading } = useCurrency();

  // Available currencies
  const currencies = [
    { code: "NPR", symbol: "NPR", country: "Nepal" },
    { code: "USD", symbol: "$", country: "USA" },
    { code: "AUD", symbol: "$", country: "Australia" },
    { code: "GBP", symbol: "£", country: "UK" },
    { code: "CAD", symbol: "$", country: "Canada" },
    { code: "EUR", symbol: "€", country: "Europe" },
    { code: "INR", symbol: "₹", country: "India" },
    { code: "CNY", symbol: "¥", country: "China" },
    { code: "JPY", symbol: "¥", country: "Japan" },
    { code: "SGD", symbol: "$", country: "Singapore" },
    { code: "AED", symbol: "د.إ", country: "UAE" },
  ];

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value;
    const [currency, country] = selectedValue.split("|");
    setCurrency(currency, country);
  };

  const currentCurrency = currencies.find((c) => c.code === selectedCurrency);

  return (
    <div className={`relative ${className}`}>
      <select
        value={`${selectedCurrency}|${currentCurrency?.country}`}
        onChange={handleCurrencyChange}
        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
      >
        {currencies.map((currency) => (
          <option
            key={currency.code}
            value={`${currency.code}|${currency.country}`}
          >
            {currency.symbol} {currency.code} - {currency.country}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};
