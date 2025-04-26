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
  Chip,
  CardFooter,
} from "@heroui/react";
import { MOTION_PROPS } from "@/app/constants/drawer.constants";
import { format } from "date-fns";
import React, {
  FC,
  isValidElement,
  cloneElement,
  useEffect,
  useState,
} from "react";
import {
  convertToBudgetCurrency,
  getBudgetStatus,
} from "@/app/utils/budget.utils";
import { CreditCard, Wallet } from "lucide-react";
import { cn } from "@/app/lib/utils";
import LinkedExpenses from "./LinkedExpenses";
import { ExtendedBudget } from "@/app/types/budget.types";
import SpendingInsights from "./SpendingInsights";

type ViewBudgetDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  budget?: ExtendedBudget | null;
};

import { useBudgetStats } from "@/app/hooks/useBudgetStats";

const ViewBudgetDetailsDrawer: FC<ViewBudgetDetailsDrawerProps> = ({ open, onClose, budget }) => {
  const { data: stats, isLoading, isError } = useBudgetStats(budget);

  if (!budget) return null;

  if (isLoading) {
    return (
      <Drawer isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }} motionProps={MOTION_PROPS} backdrop="blur">
        <DrawerContent aria-label="View Budget Details">
          <DrawerHeader>Loading...</DrawerHeader>
          <DrawerBody>
            <div className="h-6 bg-muted rounded w-1/2 mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  if (isError || !stats) {
    return (
      <Drawer isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }} motionProps={MOTION_PROPS} backdrop="blur">
        <DrawerContent aria-label="View Budget Details">
          <DrawerHeader>Error loading budget stats</DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  const { expensesTotal, budgetStatus } = stats;

  return (
    <Drawer
      isOpen={open}
      onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
      motionProps={MOTION_PROPS}
      backdrop="blur"
    >
      <DrawerContent aria-label="View Budget Details">
        <DrawerHeader className="flex items-center gap-3">
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center",
              budgetStatus === "success" && "bg-success/20",
              budgetStatus === "warning" && "bg-warning/20",
              budgetStatus === "danger" && "bg-danger/20"
            )}
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
        <DrawerBody className="gap-4">
          <div
            className={cn(
              "p-4 rounded-lg grid grid-cols-2 gap-4",
              budgetStatus === "success" && "bg-success/10",
              budgetStatus === "warning" && "bg-warning/10",
              budgetStatus === "danger" && "bg-danger/10"
            )}
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
                    {expensesTotal.toFixed(2)}
                  </span>
                </div>
              </CardBody>
            </Card>
            <Card className="col-span-2">
              <CardHeader className="text-muted-foreground justify-between pb-0">
                <span>Budget Progress</span>
                <Chip size="sm" color={budgetStatus ?? undefined}>
                  {((expensesTotal / budget.amount) * 100).toFixed(2)}%
                  used
                </Chip>
              </CardHeader>
              <CardBody>
                <Progress
                  aria-label={`budget progress for ${budget.category.name}`}
                  value={
                    budget.amount === 0
                      ? 0
                      : (expensesTotal / budget.amount) * 100
                  }
                  color={budgetStatus ?? undefined}
                />
              </CardBody>
              <CardFooter className="flex items-center justify-between pt-0">
                <span className="font-bold">
                  {budget.currency.symbol}
                  {expensesTotal.toFixed(2)} spent
                </span>
                <span className="font-bold">
                  {budget.currency.symbol}
                  {(budget.amount - expensesTotal).toFixed(2)} remaining
                </span>
              </CardFooter>
            </Card>
          </div>
          <LinkedExpenses expenses={budget.expenses} />
          <SpendingInsights
            dailyAverage={0}
            targetAverage={0}
            spendingTip={""}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewBudgetDetailsDrawer;
