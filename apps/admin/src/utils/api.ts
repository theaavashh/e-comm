/**
 * Get the API base URL from environment variables
 * @throws Error if NEXT_PUBLIC_API_BASE_URL is not set
 */
export function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4444';
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set in environment variables. Please check your .env.local file');
  }
  return apiUrl;
}

