import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Progress,
} from "@nextui-org/react";
import { BarChart3, DollarSign, TrendingUp, Wallet } from "lucide-react";

const BudgetData = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium">Total Budget</h3>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0">
          <div className="text-2xl font-bold">$2000.00</div>
          <p className="text-xs text-muted-foreground">For this semester</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium">Spent</h3>
          <Wallet className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0">
          <div className="text-2xl font-bold">$1080.00</div>
          <p className="text-xs text-muted-foreground">54.0% of total budget</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium">Remaining</h3>
          <BarChart3 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0">
          <div className="text-2xl font-bold">$920.00</div>
          <Progress
            className="mt-2"
            aria-label="progress"
            color="success"
            value={54}
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="justify-between p-6 pb-2 items-center">
          <h3 className="tracking-tight text-sm font-medium">Savings Goal</h3>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardBody className="p-6 pt-0">
          <div className="text-2xl font-bold">$500.00</div>
          <p className="text-xs text-muted-foreground">$350.00 saved so far</p>
          <Progress
            className="mt-2"
            aria-label="progress"
            color="success"
            value={65}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default BudgetData;
