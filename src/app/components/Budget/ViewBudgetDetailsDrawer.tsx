import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Badge,
} from "@heroui/react";
import { MOTION_PROPS } from "@/app/constants/drawer.constants";
import { format } from "date-fns";
import { FC, isValidElement, cloneElement, useEffect, useState } from "react";
import {
  convertToBudgetCurrency,
  getBudgetStatus,
} from "@/app/utils/budget.utils";
import { CreditCard, Wallet } from "lucide-react";

const ViewBudgetDetailsDrawer: FC<{
  trigger: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  budget: any;
}> = ({ trigger, budget }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [budgetStatus, setBudgetStatus] = useState<
    "success" | "warning" | "danger" | undefined
  >(undefined);
  const [expensesTotal, setExpensesTotal] = useState<number>(0);

  useEffect(() => {
    const calculateExpenses = async () => {
      let total = 0;
      for (const expense of budget.expenses) {
        if (expense.currency.code !== budget.currency.code) {
          const convertedAmount = await convertToBudgetCurrency(
            expense.amount,
            expense.currency.code,
            budget.currency.code
          );
          total += convertedAmount;
        } else {
          total += expense.amount;
        }
      }
      setExpensesTotal(total);
      setBudgetStatus(getBudgetStatus(budget.amount, total));
    };
    calculateExpenses();
  }, [budget]);

  console.log(budget);

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
        backdrop="blur"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex items-center gap-3">
                <div
                  className={`size-10 bg-${budgetStatus}/20 rounded-full flex items-center justify-center`}
                >
                  {budget.category.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{budget.category.name}</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(budget.startDate), "MMM d")} -{" "}
                    {format(new Date(budget.endDate), "MMM d, yyyy")}
                  </p>
                </div>
              </DrawerHeader>
              <DrawerBody>
                <div
                  className={`p-4 rounded-lg grid grid-cols-2 gap-4 bg-${budgetStatus}/20`}
                >
                  <Card>
                    <CardHeader className="text-muted-foreground gap-2 pb-0">
                      <Wallet className="size-4" />
                      <span>Total Budget</span>
                    </CardHeader>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-2xl">
                          {budget.currency.symbol}
                          {budget.amount}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader className="text-muted-foreground gap-2 pb-0">
                      <CreditCard className="size-4" />
                      <span>Spent So Far</span>
                    </CardHeader>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-2xl">
                          {budget.currency.symbol}
                          {expensesTotal}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="col-span-2">
                    <CardHeader className="text-muted-foreground justify-between pb-0">
                      <span>Budget Progress</span>
                      <Badge color={budgetStatus}>{budgetStatus}</Badge>
                    </CardHeader>
                    <CardBody>
                      <Progress
                        value={
                          budget.amount === 0
                            ? 0
                            : (expensesTotal / budget.amount) * 100
                        }
                        color={budgetStatus ?? undefined}
                      />
                    </CardBody>
                  </Card>
                </div>
              </DrawerBody>
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
