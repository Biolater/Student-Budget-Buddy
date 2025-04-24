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
import { truncate } from "@/app/utils/trunucate";

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
        <TableBody items={expenses}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => {
                // Only allow keys that exist on ExpenseItem
                const key = TABLE_COLUMNS.find(
                  (col) => col.key === columnKey
                )?.key;
                const { truncatedText, isTruncated } = truncate(
                  item.description || "No description available",
                  24
                );
                console.log(truncatedText, item.description);
                if (key === "date") {
                  return (
                    <TableCell>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : ""}
                    </TableCell>
                  );
                }
                // If key is not a valid keyof ExpenseItem, render empty string
                if (key === "description") {
                  return (
                    <TableCell>
                      {truncatedText}
                      {/*                         <Button
                          onPress={() => handleRead(item.id)}
                          className="text-muted-foreground cursor-pointer block"
                        >
                          {isTruncated ? "Read more" : "Read less"}
                        </Button> */}
                    </TableCell>
                  );
                }
                return (
                  <TableCell>
                    {item.currency.symbol}
                    {item.amount}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LinkedExpenses;
