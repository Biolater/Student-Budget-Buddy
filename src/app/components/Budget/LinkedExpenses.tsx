"use client";

import { ExpenseItem } from "@/app/types/expense.types";
import { Button, Chip, Pagination, Skeleton } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { FC, useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Link as HerouiLink } from "@heroui/react";
import { truncate } from "@/app/utils/trunucate";
import { cn } from "@/app/lib/utils";

interface LinkedExpensesProps {
  expenses: ExpenseItem[];
  isLoading: boolean;
}

const TABLE_COLUMNS: { key: keyof ExpenseItem; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
];

const LinkedExpenses: FC<LinkedExpensesProps> = ({ expenses, isLoading }) => {
  const [showDescriptionFor, setShowDescriptionFor] = useState<Set<string>>(
    new Set()
  );
  const handleRead = useCallback((expenseId: string) => {
    setShowDescriptionFor((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(expenseId)) {
        newSet.delete(expenseId);
      } else {
        newSet.add(expenseId);
      }
      return newSet;
    });
  }, []);
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(expenses.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return expenses.slice(start, end);
  }, [page, expenses]);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Linked Expenses</h3>
          <Chip className="px-2" size="sm">
            {expenses.length}
          </Chip>
        </div>
        <Button
          as={Link}
          href={"/expenses"}
          color="secondary"
          startContent={<PlusIcon />}
        >
          Add
        </Button>
      </div>
      <Skeleton className="rounded-lg" isLoaded={!isLoading}>
        <Table
          aria-label="Linked Expenses"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader columns={TABLE_COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {TABLE_COLUMNS.map(({ key }) => {
                  if (key === "date") {
                    return (
                      <TableCell>
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : ""}
                      </TableCell>
                    );
                  }
                  if (key === "description") {
                    return (
                      <TableCell>
                        {item.description && item.description.length > 24 ? (
                          <>
                            {showDescriptionFor.has(item.id)
                              ? item.description
                              : `${item.description.slice(0, 24)}...`}
                            <HerouiLink
                              onPress={() => handleRead(item.id)}
                              className="text-muted-foreground cursor-pointer block"
                              size="sm"
                              underline="hover"
                              aria-expanded={showDescriptionFor.has(item.id)}
                            >
                              {showDescriptionFor.has(item.id)
                                ? "Read less"
                                : "Read more"}
                            </HerouiLink>
                          </>
                        ) : (
                          item.description
                        )}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell>
                      {item.currency.symbol}
                      {item.amount}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Skeleton>
    </div>
  );
};

export default LinkedExpenses;
