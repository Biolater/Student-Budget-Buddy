import { fetchDefaultUserCurrency, fetchCurrencies } from "@/app/data/currency";
import { fetchExpenseCategories } from "@/app/data/category";
import { fetchExpensesPaginated } from "@/app/data/expenses";
import ExpensePageClient from "./ExpensePageClient";

type ExpensePageServerProps = {
  searchParams?: Promise<{
    page?: string;
    query?: string;
  }>;
};

export default async function ExpensePageServer({ searchParams }: ExpensePageServerProps) {
  // Await and parse search params
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.query || '';
  
  // Fetch shared data and paginated expenses
  const [categories, currencies, defaultCurrency, expensesResponse] = await Promise.all([
    fetchExpenseCategories(),
    fetchCurrencies(), 
    fetchDefaultUserCurrency(),
    fetchExpensesPaginated(page, 10, searchQuery) // 10 items per page
  ]);

  // Handle response with proper fallbacks
  const paginatedData = expensesResponse?.success && expensesResponse.data ? expensesResponse.data : {
    expenses: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: page,
    hasMore: false,
  };

  return (
    <ExpensePageClient
      categories={categories || []}
      currencies={currencies || []}
      defaultCurrency={defaultCurrency}
      expenses={paginatedData.expenses}
      totalPages={paginatedData.totalPages}
      currentPage={paginatedData.currentPage}
      searchQuery={searchQuery}
    />
  );
} 