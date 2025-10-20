export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    next: { revalidate: process.env.NODE_ENV === "production" ? 3600 : 0 },
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api${endpoint}`,
      { ...defaultOptions, ...options }
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
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

// Cache the promises to avoid duplicate requests during static generation
const promiseCache = new Map();

export function cachedFetch(url, options = {}) {
  if (!promiseCache.has(url)) {
    promiseCache.set(url, fetchAPI(url, options));
  }
  return promiseCache.get(url);
}
