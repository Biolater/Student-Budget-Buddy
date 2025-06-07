'use server';

import {
  fetchExpenseCategories,
  fetchBudgetCategories,
} from "../data/category";

export async function fetchExpenseCategoriesForSelect() {
  try {
    return await fetchExpenseCategories();
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    throw new Error("Could not fetch currencies");
  }
}

export async function fetchBudgetCategoriesForSelect() {
  try {
    return await fetchBudgetCategories();
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    throw new Error("Could not fetch currencies");
  }
}
