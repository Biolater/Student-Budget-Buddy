import { Skeleton } from "@heroui/react";

const ExpenseFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Field Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Date</div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Currency Field Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Currency</div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Category Field Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Category</div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Amount Field Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Amount</div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Description Field Skeleton */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <div className="text-sm font-medium">Description</div>
          <Skeleton className="h-[4.75rem] w-full rounded-xl" />
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex md:justify-end">
        <Skeleton className="h-10 w-full md:w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default ExpenseFormSkeleton;
