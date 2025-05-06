import { Skeleton } from "@heroui/react";

const CreateBudgetFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="w-20 h-5 rounded-xl" />
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-20 h-5 rounded-xl" />
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-20 h-5 rounded-xl" />
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-20 h-5 rounded-xl" />
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-20 h-5 rounded-xl" />
        <Skeleton className="w-full h-20 rounded-xl" />
      </div>
      <Skeleton className="w-full h-10 rounded-xl" />
    </div>
  );
};

export default CreateBudgetFormSkeleton;
