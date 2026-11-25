/**
 * API Service Client
 * Switches seamlessly between Mock Data and live FastAPI backend.
 */

export const USE_LIVE_API = false; // Toggle to true once Avinash starts backend
export const API_BASE_URL = 'http://localhost:8000/api';

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText}`);
  }

  return response.json();
}
