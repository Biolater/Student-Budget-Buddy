"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";

const APIS = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      console.log(token);
      setToken(token as string);
    };
    fetchToken();
  }, [getToken]);

  const testApi = async () => {
    if (!token) return;
    const response = await fetch(
      "http://localhost:3001/api/v1/dashboard/spending-trends",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="w-full h-svh flex items-center justify-center">
      <Button onPress={testApi}>Test API</Button>
    </div>
  );
};

export default APIS;
