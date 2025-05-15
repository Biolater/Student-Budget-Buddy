import ApiResponse from "../types/api-response.types";

/**
 * ResponseHandler class for consistent API response handling using OOP principles
 * Works with the existing ApiResponse interface
 */
export class ResponseHandler<T> {
  /**
   * Creates a success response
   */
  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      error: null,
    };
  }

  /**
   * Creates an error response
   */
  static error<T>(code: number, message: string): ApiResponse<T> {
    return {
      success: false,
      data: null,
      error: {
        code,
        message,
      },
    };
  }

  /**
   * Handles an unknown error by converting it to an ApiResponse
   */
  static handleError<T>(error: unknown): ApiResponse<T> {
    console.error("API Error:", error);

    if (error instanceof Error) {
      return ResponseHandler.error(500, error.message);
    }

    return ResponseHandler.error(500, "An unknown error occurred");
  }

  /**
   * Safely executes a function and returns an ApiResponse
   */
  static async execute<T>(fn: () => Promise<T> | T): Promise<ApiResponse<T>> {
    try {
      const result = await fn();
      return ResponseHandler.success(result);
    } catch (error) {
      return ResponseHandler.handleError<T>(error);
    }
  }
}
