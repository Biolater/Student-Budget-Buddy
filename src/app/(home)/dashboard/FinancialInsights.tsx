import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Info,
} from "lucide-react";

type FinancialEvent = {
  title: string;
  date: string;
};

type BudgetAlert = {
  message: string;
  type: "warning" | "success" | "info";
};

type FinancialInsightsProps = {
  events?: FinancialEvent[];
  alerts?: BudgetAlert[];
};

const FinancialInsights: React.FC<FinancialInsightsProps> = ({
  alerts,
  events,
}) => {
  const getAlertIcon = (type: BudgetAlert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="p-6">
          <h3
            className="text-2xl font-semibold leading-none tracking-tight"
            data-id="60"
          >
            Upcoming Financial Events
          </h3>
        </CardHeader>
        <CardBody className="p-6 pt-0">
          {events ? (
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Tuition Payment Due</span>
                <span className="font-medium">Sep 15</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Scholarship Application Deadline</span>
                <span className="font-medium">Oct 1</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Financial Aid Workshop</span>
                <span className="font-medium">Oct 10</span>
              </li>
            </ul>
          ) : (
            <div className="text-center text-muted-foreground space-y-2">
              <p>No upcoming events</p>
              <p className="text-sm">
                Add your first financial deadline to get started
              </p>
            </div>
          )}
        </CardBody>
        <CardFooter className="p-6 pt-0">
          <Button variant="bordered" className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            View All Events
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="p-6">
          <h3
            className="text-2xl font-semibold leading-none tracking-tight"
            data-id="60"
          >
            Budget Health
          </h3>
        </CardHeader>
        <CardBody className="p-6 pt-0">
          {alerts ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                <span>You&apos;re 5% over your food budget this month</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Great job! You&apos;re under budget for entertainment</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                <span>Tip: Check for student discounts on textbooks</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No budget insights yet</p>
              <p className="text-sm">
                Set up your first budget to see health insights
              </p>
            </div>
          )}
        </CardBody>
        <CardFooter className="p-6 pt-0">
          <Button variant="bordered" className="w-full">
            <BookOpen className="mr-2 h-4 w-4" />
            View Detailed Analysis
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FinancialInsights;
