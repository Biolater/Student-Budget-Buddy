"use server";

import {
  fetchCurrencies,
  fetchDefaultUserCurrency as fetchDefault,
  getConversionRate as fetchRate,
} from "../data/currency";

export async function fetchCurrenciesForSelect() {
  try {
    return await fetchCurrencies();
  } catch (error) {
    throw error;
  }
}

export async function fetchDefaultUserCurrency() {
  try {
    return await fetchDefault();
  } catch (error) {
    throw error;
  }
}

export async function getConversionRate(
  baseCurrency: string,
  targetCurrency: string
) {
  try {
    return await fetchRate(baseCurrency, targetCurrency);
  } catch (error) {
    throw error;
  }
}
