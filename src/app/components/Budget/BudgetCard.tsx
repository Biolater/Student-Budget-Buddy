import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/card";

const BudgetCard = () => {
  return (
    <Card>
      <CardHeader className="w-full p-0 m-0 h-4 bg-red-500 rounded-t-lg" />
      <CardBody>
        <h1>Test</h1>
      </CardBody>
      <CardFooter className="w-full p-0 m-0 h-4 bg-blue-500 rounded-b-lg" />
    </Card>
  );
};

export default BudgetCard;
