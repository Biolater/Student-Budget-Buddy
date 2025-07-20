import { Suspense } from "react";
import ExpensePageServer from "./components/ExpensePageServer";
import { ExpensePageSkeleton } from "./components/ExpensePageSkeletons";

type ExpensePageProps = {
  searchParams?: Promise<{
    page?: string;
    query?: string;
  }>;
};

export default async function ExpensePage({ searchParams }: ExpensePageProps) {
  return (
    <Suspense fallback={<ExpensePageSkeleton />}>
      <ExpensePageServer searchParams={searchParams} />
    </Suspense>
  );
}
