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
  Skeleton,
} from "@heroui/react";
import { MOTION_PROPS } from "@/app/constants/drawer.constants";
import { format } from "date-fns";
import React, { FC, useEffect } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { cn } from "@/app/lib/utils";
import LinkedExpenses from "./LinkedExpenses";
import { ExtendedBudget } from "@/app/types/budget.types";
import SpendingInsights from "./SpendingInsights";

type ViewBudgetDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  budget?: ExtendedBudget | null;
  onDeleteBudget: (budgetId: string) => void;
};

import { useBudgetStats } from "@/app/hooks/useBudgetStats";
import useBudget from "@/app/hooks/useBudget";

const ViewBudgetDetailsDrawer: FC<ViewBudgetDetailsDrawerProps> = ({
  open,
  onClose,
  budget,
  onDeleteBudget,
}) => {
  const { data: stats, isLoading, isError } = useBudgetStats(budget);
  const { getBudgetInsights } = useBudget(budget?.userId ?? "");
  const {
    data: insights,
    isLoading: insightsLoading,
    isError: insightsError,
  } = getBudgetInsights(budget?.id ?? "");

  if (!budget) return null;

  if (isError || insightsError) {
    return (
      <Drawer
        isOpen={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
        motionProps={MOTION_PROPS}
        backdrop="blur"
      >
        <DrawerContent aria-label="View Budget Details">
          <DrawerHeader>Error loading budget stats</DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      motionProps={MOTION_PROPS}
      backdrop="blur"
    >
      <DrawerContent aria-label="View Budget Details">
        <DrawerHeader className="flex items-center gap-3">
          <Skeleton
            isLoaded={!isLoading && !insightsLoading}
            className="rounded-full"
          >
            <div
              className={cn(
                "size-10 rounded-full flex items-center justify-center",
                stats?.budgetStatus === "success" && "bg-success/20",
                stats?.budgetStatus === "warning" && "bg-warning/20",
                stats?.budgetStatus === "danger" && "bg-danger/20"
              )}
            >
              {budget.category.icon}
            </div>
          </Skeleton>
          <div>
            <Skeleton
              className="rounded-lg mb-2"
              isLoaded={!isLoading && !insightsLoading}
            >
              <h3 className="font-semibold">{budget.category.name}</h3>
            </Skeleton>
            <Skeleton
              className="rounded-lg"
              isLoaded={!isLoading && !insightsLoading}
            >
              <p className="text-muted-foreground">
                {format(new Date(budget.startDate), "MMM d")} -{" "}
                {format(new Date(budget.endDate), "MMM d, yyyy")}
              </p>
            </Skeleton>
          </div>
        </DrawerHeader>
        <DrawerBody className="gap-4 overflow-x-hidden">
          <div
            className={cn(
              "p-4 rounded-lg grid grid-cols-2 gap-4",
              stats?.budgetStatus === "success" && "bg-success/10",
              stats?.budgetStatus === "warning" && "bg-warning/10",
              stats?.budgetStatus === "danger" && "bg-danger/10",
              isLoading && insightsLoading && "bg-muted animate-pulse"
            )}
          >
            <Card>
              <CardHeader className="text-muted-foreground gap-2 pb-0">
                <Wallet className="size-4" />
                <span>Total Budget</span>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between">
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={!isLoading && !insightsLoading}
                  >
                    <span className="font-bold text-2xl">
                      {budget.currency.symbol}
                      {budget.amount}
                    </span>
                  </Skeleton>
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
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={!isLoading && !insightsLoading}
                  >
                    <span className="font-bold text-2xl">
                      {budget.currency.symbol}
                      {stats?.expensesTotal?.toFixed(2)}
                    </span>
                  </Skeleton>
                </div>
              </CardBody>
            </Card>
            <Card className="col-span-2">
              <CardHeader className="text-muted-foreground justify-between pb-0">
                <span>Budget Progress</span>
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!isLoading && !insightsLoading}
                >
                  <Chip size="sm" color={stats?.budgetStatus ?? undefined}>
                    {(
                      ((stats?.expensesTotal ?? 0) / budget.amount) *
                      100
                    ).toFixed(2)}
                    % used
                  </Chip>
                </Skeleton>
              </CardHeader>
              <CardBody>
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!isLoading && !insightsLoading}
                >
                  <Progress
                    aria-label={`budget progress for ${budget.category.name}`}
                    value={
                      budget.amount === 0
                        ? 0
                        : ((stats?.expensesTotal ?? 0) / budget.amount) * 100
                    }
                    color={stats?.budgetStatus ?? undefined}
                  />
                </Skeleton>
              </CardBody>
              <CardFooter className="flex items-center justify-between pt-0">
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!isLoading && !insightsLoading}
                >
                  <span className="font-bold">
                    {budget.currency.symbol}
                    {stats?.expensesTotal?.toFixed(2)} spent
                  </span>
                </Skeleton>
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!isLoading && !insightsLoading}
                >
                  <span className="font-bold">
                    {budget.currency.symbol}
                    {(budget.amount - (stats?.expensesTotal ?? 0)).toFixed(
                      2
                    )}{" "}
                    remaining
                  </span>
                </Skeleton>
              </CardFooter>
            </Card>
          </div>
          <LinkedExpenses
            expenses={budget.expenses}
            isLoading={isLoading && insightsLoading}
          />
          <SpendingInsights
            dailyAverage={insights?.dailyAverage ?? 0}
            targetAverage={insights?.targetDailyAverage ?? 0}
            spendingTip={insights?.tip ?? ""}
            currencySymbol={budget.currency.symbol}
            isLoading={isLoading && insightsLoading}
          />
          <Button
            onPress={() => onDeleteBudget(budget.id)}
            className="overflow-visible p-5"
            color="danger"
          >
            Delete Budget
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewBudgetDetailsDrawer;