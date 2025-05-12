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
  
  // Debug logs for production troubleshooting
  console.log('[API Request] URL:', url);
  console.log('[API Request] Method:', method);
  console.log('[API Request] Env BACKEND_BASE_URL:', process.env.BACKEND_BASE_URL);
  console.log('[API Request] Headers:', init?.headers);
  
  try {
    const response = await fetch(url, {
      method,
      ...init,
    });

    if (!response.ok) {
      console.log('[API Request] Response not OK:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      // Try to get response text for more details
      try {
        const errorText = await response.text();
        console.log('[API Request] Error response body:', errorText);
      } catch (e) {
        console.log('[API Request] Could not read error response body');
      }
      
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
    console.log('[API Request] Fetch error:', error instanceof Error ? error.message : error);
    console.log('[API Request] Error details:', error);
    
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
