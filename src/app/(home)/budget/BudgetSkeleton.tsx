import { Skeleton } from "@nextui-org/react";

const BudgetSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Skeleton className="h-5 rounded-lg w-24" />
            <Skeleton className="h-4 rounded-lg w-16" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-5 rounded-lg w-16" />
            <Skeleton className="h-4 rounded-lg w-20" />
          </div>
        </div>
        <Skeleton className="h-2 rounded-lg w-full" />
      </div>
    ))}
  </>
);

export default BudgetSkeleton;
