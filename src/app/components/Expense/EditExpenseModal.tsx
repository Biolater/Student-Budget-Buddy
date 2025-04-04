import { ExpenseCategoryRef } from "@/app/types/category.types";
import { ClientCurrencyItem } from "@/app/types/currency.types";
import { ExtendedExpense } from "@/app/types/expense.types";
import {
  DateValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useCallback } from "react";
import {
  getLocalTimeZone,
  now,
  parseZonedDateTime,
} from "@internationalized/date";
import EditExpenseForm from "./EditExpenseForm";

type EditExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  expense: ExtendedExpense | null;
  categories: ExpenseCategoryRef[];
  categoriesLoading: boolean;
  currencies: ClientCurrencyItem[];
  currenciesLoading: boolean;
};

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  categories,
  categoriesLoading,
  currencies,
  currenciesLoading,
}) => {
  // Calculate the initial date value using the expense date
  const getInitialDateValue = useCallback((): DateValue => {
    if (!expense?.date) {
      return now(getLocalTimeZone());
    }
    const date = new Date(expense.date);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localISOString = new Date(date.getTime() - timezoneOffset)
      .toISOString()
      .slice(0, -1);
    const timeZone = getLocalTimeZone();
    return parseZonedDateTime(`${localISOString}[${timeZone}]`) as DateValue;
  }, [expense]);

  return (
    <Modal
      scrollBehavior="inside"
      backdrop="blur-sm"
      size="2xl"
      isOpen={isOpen}
      placement="auto"
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex-col space-y-1.5">
              <p>Edit Expense</p>
              <p className="text-sm text-muted-foreground">
                Make changes to your expense here. Click save when you're done.
              </p>
            </ModalHeader>
            <ModalBody>
              <EditExpenseForm
                expenseId={expense?.id ?? ""}
                categoriesLoading={categoriesLoading}
                currenciesLoading={currenciesLoading}
                currencies={currencies}
                categories={categories}
                onSuccess={onCloseModal}
                initialData={{
                  date: getInitialDateValue(),
                  amount: expense?.amount ?? 0,
                  currency: expense?.currency?.code ?? "",
                  category: expense?.category?.name ?? "",
                  description: expense?.description ?? "",
                }}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditExpenseModal;
