import ky, { HTTPError } from 'ky';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'CHECK_ENV_VARIABLE_DUDE').replace(/\/$/, '');

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = import.meta.env.VITE_API_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const http = ky.create({
  prefixUrl: API_BASE_URL,
  headers: buildHeaders(),
  timeout: 15000,
  retry: {
    limit: 2,
    methods: ['get', 'post', 'put', 'delete'],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
});

export async function getJson<T>(path: string, searchParams?: Record<string, string | number | boolean | undefined>): Promise<T> {
  try {
    const response = await http.get(path, { searchParams });
    return await response.json<T>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const text = await err.response.text();
      throw new Error(`HTTP ${err.response.status} ${err.response.statusText}: ${text || 'Request failed'}`);
    }
    throw err;
  }
}
