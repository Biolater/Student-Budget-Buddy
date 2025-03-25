"use client";

import { useEffect, useMemo, useState } from "react";
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
  Tooltip,
  Link,
  DateValue,
} from "@heroui/react";
import { TABLE_HEADERS } from "@/app/constants/expense.constants";
// import { Expense } from "../../(home)/expenses/page";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import ExpenseForm from "./ExpenseForm";
import toast from "react-hot-toast";
import useExpenses from "@/app/hooks/useExpense";
import { ClientCurrencyItem } from "@/app/types/currency.types";
import { ExtendedExpense } from "@/app/types/expense.types";
import EditExpenseForm from "./EditExpenseForm";
import {
  getLocalTimeZone,
  now,
  parseZonedDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import { ExpenseCategoryRef } from "@/app/types/category.types";

const DESCRIPTION_TRUNCATE_LENGTH = 40;
const ITEMS_PER_PAGE = 5;

const ExpenseItems: React.FC<{
  userId: string | null | undefined;
  expenses: ExtendedExpense[];
  expensesLoading: boolean;
  currencies: ClientCurrencyItem[];
  categories: ExpenseCategoryRef[];
  currenciesLoading: boolean;
  categoriesLoading: boolean;
}> = ({
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
    delete: {
      mutateAsync: deleteExpense,
      isPending: isDeleting,
      error: deleteError,
    },
  } = useExpenses(userId);
  // const updateTriggerRef = useRef(false);
  // const [editExpense, setEditExpense] = useState<Expense | null>(null);
  // const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
  // const [isUpdating, setIsUpdating] = useState(false);
  // const [showDescriptionFor, setShowDescriptionFor] = useState<Set<string>>(
  //   new Set()
  // ); // Set to store expense IDs whose description is expanded
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const handleDeleteButtonClick = (expenseId: string) => {
    setDeleteExpenseId(expenseId);
    onDeleteModalOpen();
  };

  const {
    isOpen: editModelOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalChange,
  } = useDisclosure();

  const {
    isOpen: deleteModelOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalChange,
  } = useDisclosure();

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      onDeleteModalChange();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleEditButtonClick = (expense: ExtendedExpense) => {
    setEditExpense(expense);
    onEditModalOpen();
  };

  // const handleEditModalOpen = (expense: Expense) => {
  //   onEditModalOpen();
  //   setEditExpense(expense);
  // };
  // const handleDeleteModalOpen = (expense: Expense) => {
  //   onDeleteModalOpen();
  //   setDeleteExpense(expense);
  // };
  // const handleDeleteExpense = async (id: string) => {
  //   try {
  //     await mutateDelete(id);
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error ? error.message : "Something went wrong"
  //     );
  //   }
  // };
  // const handleUpdateButtonClick = async () => {
  //   updateTriggerRef.current = true;
  //   setIsUpdating(true);
  // };
  // const handleUpdateFinished = () => {
  //   setEditExpense(null);
  //   updateTriggerRef.current = false;
  //   setIsUpdating(false);
  //   onEditModalChange();
  // };
  // const handleRead = (expenseId: string) => {
  //   setShowDescriptionFor((prev) => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(expenseId)) {
  //       newSet.delete(expenseId);
  //     } else {
  //       newSet.add(expenseId);
  //     }
  //     return newSet;
  //   });
  // };
  const sortedItems = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof ExtendedExpense]; // Expense
      const second = b[sortDescriptor.column as keyof ExtendedExpense]; // Expense
      if (first === null || first === undefined) return 1;
      if (second === null || second === undefined) return -1;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, expenses]);

  const hasMore = expenses.length > displayCount;

  const handleShowMoreClick = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleShowLessClick = () => {
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const currentItems = useMemo(() => {
    return sortedItems.slice(0, displayCount);
  }, [sortedItems, displayCount]);

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={deleteModelOpen}
        placement="auto"
        onOpenChange={onDeleteModalChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex-col space-y-1.5">
                <p>Delete Expense</p>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this expense? This action
                  cannot be undone.
                </p>
              </ModalHeader>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isDisabled={isDeleting}
                  isLoading={isDeleting}
                  color="danger"
                  onPress={() => {
                    if (deleteExpenseId) {
                      handleDeleteExpense(deleteExpenseId);
                    } else {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  Delete Expense
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        scrollBehavior="inside"
        backdrop="blur"
        size="2xl"
        isOpen={editModelOpen}
        placement="auto"
        onOpenChange={onEditModalChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex-col space-y-1.5">
                <p>Edit Expense</p>
                <p className="text-sm text-muted-foreground">
                  Make changes to your expense here. Click save when you&apos;re
                  done.
                </p>
              </ModalHeader>
              <ModalBody>
                <EditExpenseForm
                  categoriesLoading={categoriesLoading}
                  currenciesLoading={currenciesLoading}
                  currencies={currencies}
                  categories={categories}
                  initialData={{
                    date: (() => {
                      const rawDate = editExpense?.date;
                      if (!rawDate) return now(getLocalTimeZone());

                      const date = new Date(rawDate);
                      const timezoneOffset = date.getTimezoneOffset() * 60000;
                      const localISOString = new Date(
                        date.getTime() - timezoneOffset
                      )
                        .toISOString()
                        .slice(0, -1);

                      const timeZone = getLocalTimeZone(); // or Intl.DateTimeFormat().resolvedOptions().timeZone;
                      return parseZonedDateTime(
                        `${localISOString}[${timeZone}]`
                      ) as DateValue;
                    })(),
                    amount: editExpense?.amount ?? 0,
                    // Map currency to a string (using the currency code, for example)
                    currency: editExpense?.currency?.code ?? "",
                    // If category is an object, map it to a string as well
                    category: editExpense?.category?.name ?? "",
                    description: editExpense?.description ?? "",
                  }}
                />
              </ModalBody>
              {/* <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={isUpdating}
                  isLoading={isUpdating}
                  onPress={handleUpdateButtonClick}
                >
                  {!isUpdating && "Update Expense"}
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
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
                  index === currentItems.length - 1
                    ? ""
                    : "border-b border-border"
                } hover:bg-primary-opacity transition-colors duration-200 ease-in-out`}
              >
                <TableCell className="whitespace-nowrap">
                  {format(expense.date, "MMM d, yyyy, h:mm a")}
                </TableCell>
                <TableCell>
                  {currencies.length > 0 &&
                    currencies.find((c) => c.code === expense.currency.code)
                      ?.symbol}
                  {expense.amount.toFixed(2)} {expense.currency.code}
                </TableCell>
                <TableCell>{expense.category.name}</TableCell>
                <TableCell className="min-w-[12.5rem]">
                  {expense.description &&
                  expense.description?.length > DESCRIPTION_TRUNCATE_LENGTH ? (
                    <>
                      {/* {showDescriptionFor.has(expense.id)
                        ? expense.description
                        : `${expense.description.slice(
                            0,
                            DESCRIPTION_TRUNCATE_LENGTH
                          )}...`} */}
                      <Link
                        // onPress={() => handleRead(expense.id)}
                        className="text-muted-foreground cursor-pointer block"
                        size="sm"
                        underline="hover"
                        // aria-expanded={showDescriptionFor.has(expense.id)}
                      >
                        {/* {showDescriptionFor.has(expense.id)
                          ? "Read less"
                          : "Read more"} */}
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
