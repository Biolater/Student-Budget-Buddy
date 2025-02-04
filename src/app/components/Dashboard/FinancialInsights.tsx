"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={cardVariants}>
        <Card className="bg-card h-full border-border">
          <CardHeader className="p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
              Upcoming Financial Events
            </h3>
          </CardHeader>
          <CardBody className="p-6 pt-0">
            {events && events.length > 0 ? (
              <motion.ul
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {events.map((event, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-foreground"
                  >
                    <span>{event.title}</span>
                    <span className="font-medium">{event.date}</span>
                  </li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                className="text-center text-muted-foreground space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p>No upcoming events</p>
                <p className="text-sm">
                  Add your first financial deadline to get started
                </p>
              </motion.div>
            )}
          </CardBody>
          <CardFooter className="p-6 pt-0">
            <Button variant="bordered" className="w-full text-primary">
              <Calendar className="mr-2 h-4 w-4" />
              View All Events
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <motion.div variants={cardVariants}>
        <Card className="bg-card h-full border-border">
          <CardHeader className="p-6">
            <h3
              className="text-2xl font-semibold leading-none tracking-tight text-foreground"
              data-id="60"
            >
              Budget Health
            </h3>
          </CardHeader>
          <CardBody className="p-6 pt-0">
            {alerts && alerts.length > 0 ? (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center text-foreground"
                  >
                    {getAlertIcon(alert.type)}
                    <span className="ml-2">{alert.message}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p>No budget insights yet</p>
                <p className="text-sm">
                  Set up your first budget to see health insights
                </p>
              </motion.div>
            )}
          </CardBody>
          <CardFooter className="p-6 pt-0">
            <Button variant="bordered" className="w-full text-primary">
              <BookOpen className="mr-2 h-4 w-4" />
              View Detailed Analysis
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FinancialInsights;
