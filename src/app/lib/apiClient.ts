"use server";

import ApiResponse from "../types/api-response.types";

interface ApiRequestProps {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  init?: RequestInit;
}

export const apiRequest = async <T>({
  endpoint,
  method,
  init,
}: ApiRequestProps): Promise<ApiResponse<T>> => {
  const url = `${process.env.BACKEND_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      method,
      ...init,
    });

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: response.status,
          message: response.statusText || "An error occurred",
        },
        data: null,
      };
    }

    // Assume the body is JSON and matches ApiResponse<T>
    const data = (await response.json()) as ApiResponse<T>;
    return data;
  } catch (error) {
    // Handle network errors or JSON parsing errors
    return {
      success: false,
      error: {
        code: 500, // Or some other appropriate code
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      data: null,
    };
  }
};
