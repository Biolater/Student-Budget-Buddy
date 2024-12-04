"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Expense } from "./page";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import deleteAnExpense from "@/actions/Expense/deleteExpense";
import toast from "react-hot-toast";
import fetchExpensesByUser from "@/actions/Expense/fetchExpenses";

const TABLE_HEADERS = ["Date", "Amount", "Category", "Description", "Actions"];

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "TRY", symbol: "₺" },
  { code: "AZN", symbol: "₼" },
];

const ExpenseItems: React.FC<{
  userId:string | null | undefined;
  expenses: Expense[];
  expensesLoading: boolean;
  onExpenseDeletionFinished: (deletedExpense: Expense) => void;
  onExpenseCreation: (createdExpense: Expense) => void;
  onExpenseUpdate: (updatedExpense: Expense) => void;
}> = ({ userId, expenses, onExpenseDeletionFinished, onExpenseCreation, onExpenseUpdate, expensesLoading }) => {
  const updateTriggerRef = useRef(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
  const handleEditModalOpen = (expense: Expense) => {
    onEditModalOpen();
    setEditExpense(expense);
  };
  const handleDeleteModalOpen = (expense: Expense) => {
    onDeleteModalOpen();
    setDeleteExpense(expense);
  };
  const handleDeleteExpense = async (id: string) => {
    try {
      setDeleteLoading(true);
      const data = await deleteAnExpense(id);
      if (data) {
        onExpenseDeletionFinished(data);
        toast.success("Expense deleted successfully");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleUpdateButtonClick = () => {
    updateTriggerRef.current = true;
    setUpdateLoading(true);
  };
  const handleExpenseCreation = (expense: Expense) => {
    onExpenseCreation(expense);
  };
  const handleExpenseUpdate = (expense: Expense) => {
    onExpenseUpdate(expense)
  };
  const handleUpdateFinished = () => {
    updateTriggerRef.current = false;
    setUpdateLoading(false);
    setEditExpense(null);
  };

  return (
    <>
      <Modal
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
                  isDisabled={deleteLoading}
                  isLoading={deleteLoading}
                  color="danger"
                  onClick={async () => {
                    if (deleteExpense) {
                      await handleDeleteExpense(deleteExpense?.id); // Fix: Directly pass the correct expense.id here
                      onClose(); // Close modal after deletion
                    }
                  }}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
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
                <ExpenseForm
                  userId={userId}
                  onExpenseCreated={handleExpenseCreation}
                  isEditing={true}
                  editingExpense={editExpense}
                  updateTriggerState={updateTriggerRef}
                  onUpdateExpense={(expense) => {
                    handleExpenseUpdate(expense);
                    onClose();
                  }}
                  onUpdateFinished={handleUpdateFinished}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isDisabled={updateLoading}
                  isLoading={updateLoading}
                  onClick={handleUpdateButtonClick}
                >
                  {!updateLoading && "Update Expense"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table
        removeWrapper
        classNames={{ base: "w-full overflow-auto" }}
        aria-label="Expense table"
      >
        <TableHeader>
          {TABLE_HEADERS.map((column, idx) => (
            <TableColumn key={`${column}-${idx}`}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {expensesLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px] rounded-lg" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-[200px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[80px] rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            : expenses.map((expense, idx) => (
                <TableRow
                  className={`${
                    idx !== expenses.length - 1 && "border-b border-border"
                  } hover:bg-muted transition-colors duration-200 ease-in-out`}
                  key={expense.id}
                >
                  <TableCell>{format(expense.date, "PP")}</TableCell>
                  <TableCell>
                    {
                      currencies.find((c) => c.code === expense.currency)
                        ?.symbol
                    }
                    {expense.amount.toFixed(2)} {expense.currency}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2 items-center">
                      <Button
                        className="min-w-8 min-h-8 h-full rounded-xl p-3"
                        variant="light"
                        size="sm"
                        onPress={() => handleEditModalOpen(expense)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        className="min-w-8 min-h-8 h-full rounded-xl p-3"
                        onPress={() => handleDeleteModalOpen(expense)}
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
    </>
  );
};

export default ExpenseItems;
