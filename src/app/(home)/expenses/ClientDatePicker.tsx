import { DatePicker } from "@nextui-org/date-picker";
import type { DateValue } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ClientDatePickerProps {
  value: DateValue | null;
  onChange: (value: DateValue) => void;
  dateError: string;
}

export default function ClientDatePicker({
  value,
  onChange,
  dateError,
}: ClientDatePickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const dateValue = value ? value : null;
  return (
    <DatePicker
      showMonthAndYearPickers
      aria-label="Select date"
      value={dateValue}
      onChange={onChange}
      errorMessage="Date is required"
      isInvalid={dateError !== ""}
      isRequired
      size="md"
      className="w-full"
    />
  );
}
