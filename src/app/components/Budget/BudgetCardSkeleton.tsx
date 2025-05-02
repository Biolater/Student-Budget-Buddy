import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@heroui/react";

const BudgetCardSkeleton = () => {
  return (
    <Card className="group cursor-pointer transition-all">
      <CardHeader className="w-full p-0 m-0 h-1 rounded-t-lg">
        <Skeleton className="w-full h-1 rounded-lg" />
      </CardHeader>
      <CardBody className="items-start flex-row gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex justify-between items-start flex-1">
            <Skeleton className="h-6 w-10 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <Skeleton className="w-10 h-4 rounded-lg" />
            <Skeleton className="w-10 h-4 rounded-lg" />
          </div>
          <Skeleton className="w-full h-3 rounded-lg" />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <Skeleton className="w-24 h-4 rounded-lg" />
            <Skeleton className="w-24 h-4 rounded-lg" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="w-full flex items-center justify-between border-t">
        <Skeleton className="w-20 h-4 rounded-lg" />
        <Skeleton className="w-20 h-4 rounded-lg" />
      </CardFooter>
    </Card>
  );
};

export default BudgetCardSkeleton;
