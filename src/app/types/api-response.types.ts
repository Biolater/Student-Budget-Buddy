interface ErrorResponse {
  code: number;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorResponse | null;
}

export default ApiResponse;
