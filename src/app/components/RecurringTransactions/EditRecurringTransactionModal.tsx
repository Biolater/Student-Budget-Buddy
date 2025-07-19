// utils/buildRecurringTransactionUpdate.ts
// (No longer needed: diff util can be replaced by react-hook-form dirtyFields)

// components/RecurringTransactions/EditRecurringTransactionModal.tsx
import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Switch } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRecurringTransactionSchema,
  CreateRecurringTransactionSchemaType,
} from "@/app/schema/recurring-transactions.schema";
import { useAuth } from "@/app/contexts/AuthContext";
import useRecurringTransaction from "@/app/hooks/useRecurringTransaction";
import { CalendarDate, parseDate } from "@internationalized/date";
import { FinancialEventClient } from "@/app/types/recurring-transactions.types";

interface EditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactionItem: FinancialEventClient;
}

export default function EditRecurringTransactionModal({
  isOpen,
  onOpenChange,
  transactionItem,
}: EditModalProps) {
  const { userId } = useAuth();
  const { update } = useRecurringTransaction(userId);

  const toCalendarDate = (
    date: string | Date | null | undefined
  ): CalendarDate | undefined => {
    if (!date) return undefined;
    const d = typeof date === "string" ? new Date(date) : date;
    return parseDate(d.toISOString().slice(0, 10));
  };

  const form = useForm<CreateRecurringTransactionSchemaType>({
    resolver: zodResolver(CreateRecurringTransactionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      description: "",
      currencyId: "",
      budgetCategoryId: "",
      frequency: "MONTHLY",
      interval: 1,
      intervalUnit: "MONTH",
      nextDueDate: undefined,
      endDate: undefined,
      isActive: true,
      type: "EXPENSE",
    },
    mode: "onBlur", // track dirty fields on blur or change
  });

  // Reset with the current item whenever it changes
  useEffect(() => {
    form.reset({
      name: transactionItem.name,
      amount: transactionItem.amount,
      description: transactionItem.description ?? "",
      currencyId: transactionItem.currency.id,
      budgetCategoryId: transactionItem.budgetCategory?.id ?? "",
      frequency: transactionItem.frequency,
      interval: transactionItem.interval ?? 1,
      intervalUnit: transactionItem.intervalUnit ?? "MONTH",
      nextDueDate: toCalendarDate(transactionItem.nextDueDate),
      endDate: toCalendarDate(transactionItem.endDate),
      isActive: transactionItem.isActive,
      type: transactionItem.type,
    });
  }, [transactionItem, form]);

  const onSubmit = async (values: CreateRecurringTransactionSchemaType) => {
    // Build payload from react-hook-form dirty fields
    const { dirtyFields } = form.formState;
    const payload: Partial<CreateRecurringTransactionSchemaType> = {};

    Object.keys(dirtyFields).forEach((key) => {
      const field = key as keyof CreateRecurringTransactionSchemaType;
      const value = values[field];
      // Handle nullable budgetCategoryId
      if (field === "budgetCategoryId" && value === "") {
        payload.budgetCategoryId = undefined;
      } else {
        // @ts-ignore
        payload[field] = value;
      }
    });

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    await update.mutateAsync({ id: transactionItem.id, data: payload });
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        <ModalHeader>Edit Recurring Transaction</ModalHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ModalBody className="space-y-4">
            <Input label="Name" {...form.register("name")} />
            <Input
              type="number"
              label="Amount"
              {...form.register("amount", { valueAsNumber: true })}
            />
            <Input label="Description" {...form.register("description")} />
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Switch isSelected={field.value} onChange={field.onChange}>
                  Active
                </Switch>
              )}
            />
            {/* TODO: add your Select & DatePicker Controllers here */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onPress={() => onOpenChange(false)}
              isDisabled={update.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={update.isPending}
              isDisabled={!form.formState.isDirty || update.isPending}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
