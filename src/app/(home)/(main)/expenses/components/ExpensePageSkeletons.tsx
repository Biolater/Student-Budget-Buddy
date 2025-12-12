"use client";

import { Card, CardBody, Skeleton } from "@heroui/react";

export function ExpenseItemsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Skeleton for expense items */}
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardBody className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-6 w-20 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export function ExpensePageSkeleton() {
  return (
    <main className="container max-w-4xl mx-auto p-4 md:py-8 flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      
      <Card className="expense-tracker bg-card">
        <CardBody className="p-6 space-y-6">
          {/* Form skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded" />
            <Skeleton className="h-12 rounded" />
            <Skeleton className="h-12 rounded" />
            <Skeleton className="h-12 rounded" />
          </div>
          
          {/* Filter skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-48 rounded" />
            <Skeleton className="h-10 w-64 rounded" />
          </div>
          
          {/* Items skeleton */}
          <ExpenseItemsSkeleton />
        </CardBody>
      </Card>
    </main>
  );
} 