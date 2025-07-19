"use client";

import { Alert, Button } from "@heroui/react";
import { FunctionComponent } from "react";

interface ErrorProps {
  error: Error;
  reset?: () => void;
}

const RecurringTransactionsError: FunctionComponent<ErrorProps> = ({
  error,
  reset,
}) => {
  return (
    <Alert 
      color="danger"
      variant="flat"
      className="w-full max-w-md mx-auto"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Error</h3>
        <p className="text-sm">
          Failed to load recurring transactions. Please try again.
        </p>
        <div className="flex justify-end mt-2">
          <Button 
            color="danger" 
            variant="flat" 
            onPress={reset}
          >
            Try Again
          </Button>
        </div>
      </div>
    </Alert>
  );
};

export default RecurringTransactionsError;
