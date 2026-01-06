import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateCurrencyPrices() {
  try {
    console.log("Updating existing currency prices...");

    // Get all existing currency prices
    const currencyPrices = await prisma.productCurrencyPrice.findMany();

    for (const cp of currencyPrices) {
      const currency = getCurrencyForCountry(cp.country);
      const symbol = getSymbolForCurrency(currency);

      await prisma.productCurrencyPrice.update({
        where: { id: cp.id },
        data: {
          currency,
          symbol,
        },
      });
    }

    console.log(`Updated ${currencyPrices.length} currency price records`);
  } catch (error) {
    console.error("Error updating currency prices:", error);
  } finally {
    await prisma.$disconnect();
  }
}

function getCurrencyForCountry(country: string): string {
  const countryCurrencyMap: Record<string, string> = {
    Australia: "AUD",
    USA: "USD",
    UK: "GBP",
    Canada: "CAD",
    India: "INR",
    China: "CNY",
    Japan: "JPY",
    Singapore: "SGD",
    UAE: "AED",
    Nepal: "NPR",
    NPR: "NPR",
  };

  return countryCurrencyMap[country] || "NPR";
}

function getSymbolForCurrency(currency: string): string {
  const currencySymbolMap: Record<string, string> = {
    AUD: "$",
    USD: "$",
    GBP: "£",
    CAD: "$",
    EUR: "€",
    INR: "₹",
    CNY: "¥",
    JPY: "¥",
    SGD: "$",
    AED: "د.إ",
    NPR: "NPR",
  };

  return currencySymbolMap[currency] || "NPR";
}

updateCurrencyPrices();
