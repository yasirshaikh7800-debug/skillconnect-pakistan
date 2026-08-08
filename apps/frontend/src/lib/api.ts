const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

interface ApiError {
  message: string | string[];
  statusCode?: number;
}

export class ApiRequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('scpk_token');
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = (await res.json()) as ApiResponse<T> | ApiError;

  if (!res.ok) {
    const err = json as ApiError;
    const message = Array.isArray(err.message) ? err.message.join(', ') : err.message;
    throw new ApiRequestError(message || 'Request failed', res.status);
  }

  return (json as ApiResponse<T>).data;
}
