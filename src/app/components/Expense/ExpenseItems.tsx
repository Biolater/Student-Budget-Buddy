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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  type SortDescriptor,
  Link,
  DateValue,
} from "@heroui/react";
import { TABLE_HEADERS } from "@/app/constants/expense.constants";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import EditExpenseForm from "./EditExpenseForm";
import toast from "react-hot-toast";
import useExpenses from "@/app/hooks/useExpense";
import { ClientCurrencyItem } from "@/app/types/currency.types";
import { ExtendedExpense } from "@/app/types/expense.types";
import {
  getLocalTimeZone,
  now,
  parseZonedDateTime,
} from "@internationalized/date";
import { ExpenseCategoryRef } from "@/app/types/category.types";
import DeleteExpenseModal from "./DeleteExpenseModal";
import EditExpenseModal from "./EditExpenseModal";

const DESCRIPTION_TRUNCATE_LENGTH = 40;
const ITEMS_PER_PAGE = 5;

interface ExpenseItemsProps {
  userId: string | null | undefined;
  expenses: ExtendedExpense[];
  expensesLoading: boolean;
  currencies: ClientCurrencyItem[];
  categories: ExpenseCategoryRef[];
  currenciesLoading: boolean;
  categoriesLoading: boolean;
}

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
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

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
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
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

  const sortedItems = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof ExtendedExpense];
      const second = b[sortDescriptor.column as keyof ExtendedExpense];
      if (first == null) return 1;
      if (second == null) return -1;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, expenses]);

  const hasMore = expenses.length > displayCount;

  const handleShowMoreClick = useCallback(() => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const handleShowLessClick = useCallback(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, []);

  const currentItems = useMemo(
    () => sortedItems.slice(0, displayCount),
    [sortedItems, displayCount]
  );

  return (
    <>
      <DeleteExpenseModal
        isOpen={deleteModalOpen}
        onClose={onDeleteModalClose}
        onDelete={() => {
          if (deleteExpenseId) {
            handleDeleteExpense(deleteExpenseId);
          } else {
            toast.error("Something went wrong");
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

      <div className="space-y-4 w-full">
        <Table
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          removeWrapper
          classNames={{ base: "w-full overflow-auto" }}
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
            items={currentItems}
            loadingContent={<Spinner label="Loading..." />}
            isLoading={expensesLoading}
          >
            {currentItems.map((expense, index) => (
              <TableRow
                key={expense.id}
                className={`${
                  index !== currentItems.length - 1
                    ? "border-b border-border"
                    : ""
                } hover:bg-primary-opacity transition-colors duration-200 ease-in-out`}
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
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      className="min-w-8 min-h-8 h-full rounded-xl p-3"
                      onPress={() => handleDeleteButtonClick(expense.id)}
                      color="danger"
                      size="md"
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

        {expenses.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center mt-4">
            {hasMore ? (
              <Button
                variant="light"
                onPress={handleShowMoreClick}
                className="w-full max-w-[12.5rem]"
              >
                Show More
              </Button>
            ) : (
              <Button
                variant="light"
                onPress={handleShowLessClick}
                className="w-full max-w-[12.5rem]"
              >
                Show Less
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ExpenseItems;
