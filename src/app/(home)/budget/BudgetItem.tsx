import { Button, Progress, Tooltip } from "@nextui-org/react";
import { convertAmount, formatCurrency } from "@/lib/currencyUtils";
import { type ClientBudget } from "./AddNewBudget";
import { currencies } from "./CurrentBudgets";
import { Trash2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import useBudget from "@/hooks/useBudget";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

const BudgetItem: React.FC<{
  budgetItem: ClientBudget;
  totalSpentInBudgetCurrency: number;
  totalSpentPercentage: number;
  exchangeRates: Record<string, number>;
}> = ({
  budgetItem,
  totalSpentInBudgetCurrency,
  totalSpentPercentage,
  exchangeRates,
}) => {
  const {
    isOpen: deleteModalOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteChange,
  } = useDisclosure();
  const { userId } = useAuth();

  const {
    delete: { mutateAsync: deleteBudgetMutation, isPending, isSuccess },
  } = useBudget(userId);

  const handleDeleteBudget = async () => {
    try {
      await deleteBudgetMutation(budgetItem.id);
      toast.success("Budget deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{budgetItem.category}</p>
            <p className="text-sm text-muted-foreground">{budgetItem.period}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(
                  budgetItem.amount,
                  budgetItem.currency,
                  currencies
                )}
              </p>
              <Tooltip
                color="foreground"
                classNames={{
                  content:
                    "rounded-lg max-w-sm sm:max-w-[unset] py-[0.375rem] px-3",
                }}
                content={
                  <div>
                    <p className="font-medium">Individual Expenses:</p>
                    {budgetItem.expenses.map((expense, i) => (
                      <p key={i}>
                        {formatCurrency(
                          expense.amount,
                          expense.currency,
                          currencies
                        )}
                        {expense.currency !== budgetItem.currency &&
                          ` (≈${formatCurrency(
                            convertAmount(
                              expense.amount,
                              expense.currency,
                              budgetItem.currency,
                              exchangeRates
                            ),
                            budgetItem.currency,
                            currencies
                          )})`}
                      </p>
                    ))}
                  </div>
                }
              >
                <p className="text-sm cursor-pointer text-muted-foreground">
                  {formatCurrency(
                    totalSpentInBudgetCurrency,
                    budgetItem.currency,
                    currencies
                  )}{" "}
                  spent
                </p>
              </Tooltip>
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
          color={totalSpentPercentage >= 100 ? "danger" : "primary"}
          aria-label="Loading..."
          size="md"
          value={totalSpentPercentage}
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
                  <span className="font-semibold">{budgetItem.category}</span>{" "}
                  budget and remove all associated data.
                </span>
              </ModalHeader>
              <ModalFooter>
                <Button
                  isDisabled={isPending}
                  isLoading={isPending}
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  isDisabled={isPending}
                  isLoading={isPending}
                  color="danger"
                  onPress={async () => {
                    await handleDeleteBudget();
                    onClose();
                  }}
                >
                  {isPending ? null : "Delete"}
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
