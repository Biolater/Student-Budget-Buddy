import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import Link from "next/link";

const BudgetOverview = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col space-y-1.5 p-6 items-start">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Budget Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Summary of your current budget status
        </p>
      </CardHeader>
      <CardBody className="p-6 pt-0 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Total Budget</p>
          <h3 className="text-2xl font-bold">$1000</h3>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Spent</p>
          <h3 className="text-2xl font-bold">$800</h3>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Remaining</p>
          <h3 className="text-2xl font-bold">$200</h3>
        </div>
      </CardBody>
      <CardFooter className="flex items-center p-6 pt-0">
        <Button className="lg:w-full" as={Link} href="/dashboard">
          Back to Dashboard{" "}
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

export default BudgetOverview;
