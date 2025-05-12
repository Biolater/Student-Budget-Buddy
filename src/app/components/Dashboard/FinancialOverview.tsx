import { Card, CardBody, Autocomplete, AutocompleteItem } from "@heroui/react";
import { ChevronsUpDown, TrendingUp } from "lucide-react";
import { financialOverviewPeriods } from "@/app/constants/dashboard.constants";

const FinancialOverview = () => {
  return (
    <Card>
      <CardBody className="flex-col gap-4 md:flex-row">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="size-6 text-primary" />
          Financial Overview
        </h2>
        <Autocomplete
          defaultItems={financialOverviewPeriods}
          label="Select a period"
          size="sm"
          listboxProps={{
            emptyContent: "No periods available.",
          }}
          variant="faded"
          selectorIcon={
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          }
          defaultSelectedKey={financialOverviewPeriods[0].value}
          isClearable={false}
          onSelectionChange={(key) => {
            if (!key) {
              return financialOverviewPeriods[0].value;
            }
            return key;
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </CardBody>
    </Card>
  );
};

export default FinancialOverview;