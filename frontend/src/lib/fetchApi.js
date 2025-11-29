export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    next: { revalidate: process.env.NODE_ENV === "production" ? false : 0 },
  };

  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
      {
        ...defaultOptions,
        ...options,
        headers,
        next: { ...defaultOptions.next, ...options.next },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return { data: null, error: error.message };
  }
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const promiseCache = new Map();

export function cachedFetch(url, options = {}) {
  if (!promiseCache.has(url)) {
    promiseCache.set(url, fetchAPI(url, options));
  }
  return promiseCache.get(url);
}
