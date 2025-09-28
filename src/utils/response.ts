export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export function successResponse<T>(data: T, message?: string, statusCode = 200): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    statusCode,
  };
}

export function errorResponse(
  error: string,
  message?: string,
  statusCode = 500
): Omit<ApiResponse<null>, 'data'> {
  return {
    success: false,
    error,
    message,
    statusCode,
  };
}
