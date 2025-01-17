import { Card, CardHeader, CardBody, Skeleton } from "@nextui-org/react";

const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="w-1/3 h-10 mb-8 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="justify-between p-6 pb-2 items-center">
              <Skeleton className="w-1/2 h-5 rounded-lg" />
              <Skeleton className="w-4 h-4 rounded-full" />
            </CardHeader>
            <CardBody className="p-6 pt-0 space-y-2">
              <Skeleton className="w-2/3 h-8 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="p-6 pb-2">
            <Skeleton className="w-1/4 h-6 rounded-lg" />
          </CardHeader>
          <CardBody className="p-6 pt-0">
            <Skeleton className="w-full h-40 rounded-lg" />
          </CardBody>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="p-6 pb-2">
            <Skeleton className="w-1/4 h-6 rounded-lg" />
          </CardHeader>
          <CardBody className="p-6 pt-0">
            <Skeleton className="w-full h-40 rounded-lg" />
          </CardBody>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="p-6 pb-2">
            <Skeleton className="w-1/4 h-6 rounded-lg" />
          </CardHeader>
          <CardBody className="p-6 pt-0 space-y-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="w-full h-6 rounded-lg" />
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
