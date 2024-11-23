"use client";

import { useState, useEffect } from "react";
import { DatePicker } from "@nextui-org/date-picker";

export default function ClientDatePicker() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <DatePicker size="md" className="w-full" />;
}
