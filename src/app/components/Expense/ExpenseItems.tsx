"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Button,
  Spinner,
  type SortDescriptor,
  Link,
  Skeleton,
} from "@heroui/react";
import { TABLE_HEADERS } from "@/app/constants/expense.constants";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useExpenses from "@/app/hooks/useExpense";
import { ClientCurrencyItem } from "@/app/types/currency.types";
import { ExtendedExpense } from "@/app/types/expense.types";
import { ExpenseCategoryRef } from "@/app/types/category.types";
import DeleteExpenseModal from "./DeleteExpenseModal";
import EditExpenseModal from "./EditExpenseModal";

const DESCRIPTION_TRUNCATE_LENGTH = 40;

interface ExpenseItemsProps {
  userId: string | null | undefined;
  expenses: ExtendedExpense[];
  expensesLoading: boolean;
  currencies: ClientCurrencyItem[];
  categories: ExpenseCategoryRef[];
  currenciesLoading: boolean;
  categoriesLoading: boolean;
}

// Loading skeleton row component
const LoadingRow = () => (
  <TableRow>
    {TABLE_HEADERS.map((header) => (
      <TableCell key={header.key}>
        <Skeleton className="h-4 w-full rounded" />
      </TableCell>
    ))}
  </TableRow>
);

const ExpenseItems: React.FC<ExpenseItemsProps> = ({
  userId,
  expenses,
  expensesLoading,
  currencies,
  categories,
  categoriesLoading,
  currenciesLoading,
}) => {
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const [editExpense, setEditExpense] = useState<ExtendedExpense | null>(null);
  const {
    delete: { mutateAsync: deleteExpense, isPending: isDeleting },
  } = useExpenses(userId);
  const [showDescriptionFor, setShowDescriptionFor] = useState<Set<string>>(
    new Set()
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  const {
    isOpen: editModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: deleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const handleDeleteButtonClick = useCallback(
    (expenseId: string) => {
      setDeleteExpenseId(expenseId);
      onDeleteModalOpen();
    },
    [onDeleteModalOpen]
  );

  const handleRead = useCallback((expenseId: string) => {
    setShowDescriptionFor((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(expenseId)) {
        newSet.delete(expenseId);
      } else {
        newSet.add(expenseId);
      }
      return newSet;
    });
  }, []);

  const handleDeleteExpense = useCallback(
    async (id: string) => {
      try {
        await deleteExpense(id);
        onDeleteModalClose();
      } catch (error) {
        console.error(error);
      }
    },
    [deleteExpense, onDeleteModalClose]
  );

  const handleEditButtonClick = useCallback(
    (expense: ExtendedExpense) => {
      setEditExpense(expense);
      onEditModalOpen();
    },
    [onEditModalOpen]
  );

  // Sort expenses client-side (since server already handles pagination)
  const sortedItems = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    
    return [...expenses].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof ExtendedExpense];
      const second = b[sortDescriptor.column as keyof ExtendedExpense];
      if (first == null) return 1;
      if (second == null) return -1;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, expenses]);

  return (
    <>
      <DeleteExpenseModal
        isOpen={deleteModalOpen}
        onClose={onDeleteModalClose}
        onDelete={() => {
          if (deleteExpenseId) {
            handleDeleteExpense(deleteExpenseId);
          } else {
            console.error("No expense ID provided");
          }
        }}
        isDeleting={isDeleting}
      />
      <EditExpenseModal
        isOpen={editModalOpen}
        onClose={onEditModalClose}
        expense={editExpense}
        categories={categories}
        categoriesLoading={categoriesLoading}
        currencies={currencies}
        currenciesLoading={currenciesLoading}
      />

      <div className="space-y-4 w-full relative">
        {/* Loading Overlay */}
        {expensesLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" color="primary" />
              <div className="text-sm text-default-600 font-medium">Loading expenses...</div>
            </div>
          </div>
        )}
        
        <Table
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          removeWrapper
          classNames={{
            base: "w-full overflow-x-auto overflow-y-hidden",
            table: "min-h-[300px]",
          }}
          aria-label="Expense table"
        >
          <TableHeader columns={TABLE_HEADERS}>
            {(column) => (
              <TableColumn allowsSorting={column?.isSortable} key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={sortedItems}
            emptyContent={
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-lg text-default-500 mb-2">No expenses found</div>
                <div className="text-sm text-default-400">
                  {expenses?.length === 0 ? "Start by adding your first expense above." : "Try adjusting your search or filters."}
                </div>
              </div>
            }
          >
            {sortedItems.map((expense, index) => (
              <TableRow
                key={expense.id}
                className={`${
                  index !== sortedItems.length - 1 ? "border-b border-border" : ""
                } hover:bg-primary/10 transition-colors duration-200 ease-in-out ${
                  expensesLoading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <TableCell className="whitespace-nowrap">
                  {format(expense.date, "MMM d, yyyy, h:mm a")}
                </TableCell>
                <TableCell>
                  {currencies.length > 0 &&
                    currencies.find((c) => c.code === expense.currency.code)
                      ?.symbol}
                  {expense.amount.toFixed(2)}
                </TableCell>
                <TableCell>{expense.category.name}</TableCell>
                <TableCell>
                  {expense.description &&
                  expense.description.length > DESCRIPTION_TRUNCATE_LENGTH ? (
                    <>
                      {showDescriptionFor.has(expense.id)
                        ? expense.description
                        : `${expense.description.slice(
                            0,
                            DESCRIPTION_TRUNCATE_LENGTH
                          )}...`}
                      <Link
                        onPress={() => handleRead(expense.id)}
                        className="text-muted-foreground cursor-pointer block"
                        size="sm"
                        underline="hover"
                        aria-expanded={showDescriptionFor.has(expense.id)}
                        isDisabled={expensesLoading}
                      >
                        {showDescriptionFor.has(expense.id)
                          ? "Read less"
                          : "Read more"}
                      </Link>
                    </>
                  ) : (
                    expense.description
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 items-center">
                    <Button
                      className="min-w-8 min-h-8 h-full rounded-xl p-3"
                      variant="light"
                      size="sm"
                      onPress={() => handleEditButtonClick(expense)}
                      isDisabled={expensesLoading}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      className="min-w-8 min-h-8 h-full rounded-xl p-3"
                      onPress={() => handleDeleteButtonClick(expense.id)}
                      color="danger"
                      size="md"
                      isDisabled={expensesLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ExpenseItems;
