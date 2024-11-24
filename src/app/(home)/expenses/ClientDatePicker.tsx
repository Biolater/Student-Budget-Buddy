import { DatePicker } from "@nextui-org/date-picker";
import type { DateValue } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ClientDatePickerProps {
  value: DateValue | null;
  onChange: (value: DateValue) => void;
}

export default function ClientDatePicker({
  value,
  onChange,
}: ClientDatePickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const dateValue = value ? value : null;
  return (
    <DatePicker
      aria-label="Select date"
      value={dateValue}
      onChange={onChange}
      isRequired
      size="md"
      className="w-full"
    />
  );
}
