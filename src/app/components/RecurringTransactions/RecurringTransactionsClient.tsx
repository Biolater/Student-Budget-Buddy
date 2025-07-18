"use client";

import CreateRecurringTransactionsDrawer from "./CreateRecurringTransactionsDrawer";
import { useState } from "react";

interface RecurringTransactionsClientProps {
  defaultCurrency: string;
}

const RecurringTransactionsClient = ({
  defaultCurrency,
}: RecurringTransactionsClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div>
      <CreateRecurringTransactionsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        defaultCurrency={defaultCurrency}
      />
    </div>
  );
};

export default RecurringTransactionsClient;
