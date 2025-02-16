"use client";

import { Button, Progress, Tooltip } from "@heroui/react";
import { Trash2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { type ClientBudget } from "./AddNewBudget";
import useBudget from "@/hooks/useBudget";

const BudgetItem: React.FC<{
  budgetItem: ClientBudget;
  userId: string | undefined | null;
}> = ({ budgetItem, userId }) => {
  const {
    isOpen: deleteModalOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteChange,
  } = useDisclosure();

  const {
    delete: {
      mutateAsync: deleteBudget,
      isPending: isDeletingBudget,
    },
  } = useBudget(userId);

  const budgetCategory = budgetItem.category;
  const budgetCurrencySymbol = budgetItem.currency.symbol;
  const budgetPeriod = budgetItem.period;
  const budgetAmount = budgetItem.amount;
  const budgetSpent = budgetItem.expenses.reduce((sum, item) => {
    return sum + item.amount;
  }, 0);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{budgetCategory}</p>
            <p className="text-sm text-muted-foreground">{budgetPeriod}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="font-medium">{`${budgetCurrencySymbol} ${budgetAmount.toFixed(
                2
              )}`}</p>
              <p className="font-medium text-muted-foreground">{`${budgetCurrencySymbol} ${budgetSpent.toFixed(
                2
              )}`}</p>
            </div>
            <div>
              <Button
                onPress={onDeleteOpen}
                radius="sm"
                variant="light"
                className="min-w-[unset] w-8 h-8 items-center justify-center"
                isIconOnly
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <Progress
          color="primary"
          aria-label="Budget progress"
          size="md"
          value={70}
        />
      </div>
      <Modal isOpen={deleteModalOpen} onOpenChange={onDeleteChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure?
                <span className="text-muted-foreground text-sm font-normal">
                  This action cannot be undone. This will permanently delete the{" "}
                  <span className="font-semibold">Groceries</span> budget and
                  remove all associated data.
                </span>
              </ModalHeader>
              <ModalFooter>
                <Button
                  isDisabled={isDeletingBudget}
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={async () => {
                    await deleteBudget(budgetItem.id);
                    onClose();
                  }}
                  isLoading={isDeletingBudget}
                  isDisabled={isDeletingBudget}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BudgetItem;
