import { useEffect, useState } from "react";

const SETTINGS_KEY = "settingsPreferences";
const CURRENCY_CHANGE_EVENT = "currencychange";
export const SUPPORTED_CURRENCIES = ["EUR", "TND", "USD"];

export const getSelectedCurrency = () => {
  try {
    const { currency } = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return SUPPORTED_CURRENCIES.includes(currency) ? currency : "TND";
  } catch {
    return "TND";
  }
};

export const setSelectedCurrency = (currency) => {
  if (!SUPPORTED_CURRENCIES.includes(currency)) return;
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...settings, currency }));
  window.dispatchEvent(new Event(CURRENCY_CHANGE_EVENT));
};

export const getCurrencyLabel = (currency = getSelectedCurrency()) =>
  currency;

export const formatCurrency = (value, currency = getSelectedCurrency(), locale = "fr-FR") => {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: currency === "TND" ? "code" : "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
  return formatted;
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState(getSelectedCurrency);
  useEffect(() => {
    const syncCurrency = () => setCurrency(getSelectedCurrency());
    window.addEventListener(CURRENCY_CHANGE_EVENT, syncCurrency);
    window.addEventListener("storage", syncCurrency);
    return () => {
      window.removeEventListener(CURRENCY_CHANGE_EVENT, syncCurrency);
      window.removeEventListener("storage", syncCurrency);
    };
  }, []);
  return currency;
};
