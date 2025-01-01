import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Progress,
} from "@nextui-org/react";
import Link from "next/link";

const CurrentBudgets = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col space-y-1.5 p-6 items-start">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Current Budgets
        </h3>
        <p className="text-sm text-muted-foreground">
          View and manage your existing budgets
        </p>
      </CardHeader>
      <CardBody className="p-6 pt-0 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Food</p>
              <p className="text-sm text-muted-foreground">Monthly</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$300</p>
              <p className="text-sm text-muted-foreground">$180 spent</p>
            </div>
          </div>
          <Progress aria-label="Loading..." size="md" value={40} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Food</p>
              <p className="text-sm text-muted-foreground">Monthly</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$300</p>
              <p className="text-sm text-muted-foreground">$180 spent</p>
            </div>
          </div>
          <Progress aria-label="Loading..." size="md" value={40} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Food</p>
              <p className="text-sm text-muted-foreground">Monthly</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$300</p>
              <p className="text-sm text-muted-foreground">$180 spent</p>
            </div>
          </div>
          <Progress aria-label="Loading..." size="md" value={40} />
        </div>
      </CardBody>
      <CardFooter className="flex items-center p-6 pt-0">
        <Button as={Link} className="lg:w-full" href="/expenses">
          View Expenses{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-right ml-2 h-4 w-4"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CurrentBudgets;
