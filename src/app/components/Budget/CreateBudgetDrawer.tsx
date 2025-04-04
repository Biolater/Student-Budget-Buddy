import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Plus } from "lucide-react";
import CreateBudgetForm from "../forms/Budget/CreateBudgetForm";

const MOTION_PROPS = {
  variants: {
    enter: {
      opacity: 1,
      x: 0,
    },
    exit: {
      x: 100,
      opacity: 0,
    },
  },
  transition: {
    duration: 0.3,
    ease: "easeInOut",
  },
};

export default function CreateBudgetDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        aria-label="Create Budget"
        startContent={<Plus />}
        color="primary"
        onPress={onOpen}
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
              <DrawerBody>
                <CreateBudgetForm onSuccess={onClose} />
              </DrawerBody>
              {/*               <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter> */}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
