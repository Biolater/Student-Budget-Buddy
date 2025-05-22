import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@heroui/react";
import { Plus } from "lucide-react";
import CreateBudgetForm from "../forms/CreateBudgetForm";
import { MOTION_PROPS } from "@/app/constants/drawer.constants";

interface CreateBudgetDrawerProps {
  defaultCurrency: string;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

export default function CreateBudgetDrawer({
  defaultCurrency,
  onOpenChange,
  isOpen,
}: CreateBudgetDrawerProps) {
  return (
    <>
      <Button
        aria-label="Create Budget"
        startContent={<Plus />}
        color="primary"
        onPress={() => onOpenChange(true)}
      >
        New Budget
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
                <h1 className="text-lg">Create New Budget</h1>
                <p className="text-muted-foreground text-sm">
                  Create a new budget to manage your spending
                </p>
              </DrawerHeader>
              <DrawerBody className="py-4">
                <CreateBudgetForm
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
