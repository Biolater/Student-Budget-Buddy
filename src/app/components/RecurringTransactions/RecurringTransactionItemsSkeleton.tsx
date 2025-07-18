'use client'

import { Card, CardHeader, CardBody, CardFooter, Skeleton } from "@heroui/react";

const RecurringTransactionItemsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="w-full animate-pulse">
          {/* Header skeleton: title and status chip */}
          <CardHeader className="flex items-center justify-between px-4 py-2">
            <Skeleton className="w-2/5 h-6 rounded-lg" />
            <Skeleton className="w-1/5 h-5 rounded-full" />
          </CardHeader>

          {/* Body skeleton: date, frequency, amount and description */}
          <CardBody className="px-4 py-2 space-y-3">
            {/* Row: date */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-1/3 h-4 rounded-lg" />
            </div>

            {/* Row: frequency */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-1/4 h-4 rounded-lg" />
            </div>

            {/* Row: amount */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-2/5 h-5 rounded-lg" />
            </div>

            {/* Optional description skeleton */}
            <div className="space-y-1 mt-2">
              <Skeleton className="w-full h-3 rounded-lg" />
              <Skeleton className="w-3/5 h-3 rounded-lg" />
            </div>
          </CardBody>

          {/* Footer skeleton: action buttons */}
          <CardFooter className="flex justify-end px-4 py-2 space-x-2">
            <Skeleton className="w-12 h-6 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RecurringTransactionItemsSkeleton;
