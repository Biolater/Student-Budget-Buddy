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
      setToken(token as string);
    };
    fetchToken();
  }, []);

  const testApi = async () => {
    if (!token) return;
    const response = await fetch(
      "http://localhost:3001/api/v1/insights/budget/3aa71b1b-e17d-45be-b6a1-f8744be6ad8d",
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
