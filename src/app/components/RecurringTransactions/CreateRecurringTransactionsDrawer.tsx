import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@heroui/react";
import { Plus } from "lucide-react";
import CreateRecurringTransactionForm from "../forms/CreateRecurringTransactionForm";
import { MOTION_PROPS } from "@/app/constants/drawer.constants";

interface CreateRecurringTransactionsDrawerProps {
  defaultCurrency: string;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

export default function CreateRecurringTransactionsDrawer({
  defaultCurrency,
  onOpenChange,
  isOpen,
}: CreateRecurringTransactionsDrawerProps) {
  return (
    <>
      <Button
        aria-label="Create Recurring Transaction"
        startContent={<Plus />}
        color="primary"
        onPress={() => onOpenChange(true)}
      >
        New Recurring Transaction
      </Button>
      <Drawer
        backdrop="blur"
        isOpen={isOpen}
        motionProps={MOTION_PROPS}
        size="sm"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <h1 className="text-lg">Create Recurring Transaction</h1>
                <p className="text-muted-foreground text-sm">
                  Create a new recurring transaction to track regular payments
                  or income
                </p>
              </DrawerHeader>
              <DrawerBody className="py-4">
                <CreateRecurringTransactionForm
                  onSuccess={onClose}
                  defaultCurrency={defaultCurrency}
                />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
