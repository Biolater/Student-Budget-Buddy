"use client";

import { ExpenseItem } from "@/app/types/expense.types";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { FC, useCallback, useState } from "react";
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
}

const TABLE_COLUMNS: { key: keyof ExpenseItem; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
];

const LinkedExpenses: FC<LinkedExpensesProps> = ({ expenses }) => {
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
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Linked Expenses</h3>
        <Button
          as={Link}
          href={"/expenses"}
          color="secondary"
          startContent={<PlusIcon />}
        >
          Add
        </Button>
      </div>
      <Table aria-label="Linked Expenses">
        <TableHeader columns={TABLE_COLUMNS}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {expenses.map((item) => (
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
    </div>
  );
};

export default LinkedExpenses;
