import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { MOTION_PROPS } from "@/app/constants/drawer.constants";
import { FC, isValidElement, cloneElement } from "react";

const ViewBudgetDetailsDrawer: FC<{
  trigger: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
}> = ({ trigger }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const enhancedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (e) => {
          trigger.props?.onClick?.(e); // preserve original onClick if any
          onOpen();
        },
      })
    : trigger;

  return (
    <>
      {enhancedTrigger}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={MOTION_PROPS}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Drawer Title
              </DrawerHeader>
              <DrawerBody>{/* Your drawer content */}</DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ViewBudgetDetailsDrawer;
