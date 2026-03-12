import type { ApiResult, NewsItem, NewsItemResult } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "";

type FetchOptions = {
  body?: unknown;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
};

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  if ("message" in data && typeof data.message === "string") {
    return data.message;
  }

  if ("error" in data && typeof data.error === "string") {
    return data.error;
  }

  return fallback;
}

/**
 * Sends a request to the backend and normalizes success and error results.
 */
export async function fetchFromApi<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResult<T>> {
  let url: URL;

  try {
    url = new URL(path, API_URL);
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      error: {
        message: "VITE_API_URL er ekki gilt URL.",
        details: error,
      },
    };
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers:
        options.body !== undefined
          ? {
              "Content-Type": "application/json",
            }
          : undefined,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      error: {
        message: "Ekki tókst að hafa samband við vefþjónustu.",
        details: error,
      },
    };
  }

  let data: unknown = null;
  const hasJsonBody = response.headers.get("content-type")?.includes("application/json");

  if (hasJsonBody) {
    try {
      data = await response.json();
    } catch (error) {
      return {
        ok: false,
        reason: "error",
        status: response.status,
        error: {
          message: "Svar frá vefþjónustu var ekki gilt JSON.",
          details: error,
        },
      };
    }
  }

  if (!response.ok) {
    if (response.status === 404) {
      return {
        ok: false,
        reason: "not-found",
        status: response.status,
        error: {
          message: getErrorMessage(data, "Fann ekki það sem var beðið um."),
          status: response.status,
          details: data,
        },
      };
    }

    if (response.status >= 400 && response.status < 500) {
      return {
        ok: false,
        reason: "validation",
        status: response.status,
        error: {
          message: getErrorMessage(data, "Gögnin sem voru send inn eru ekki gild."),
          status: response.status,
          details: data,
        },
      };
    }

    return {
      ok: false,
      reason: "error",
      status: response.status,
      error: {
        message: getErrorMessage(data, "Villa kom upp í vefþjónustu."),
        status: response.status,
        details: data,
      },
    };
  }

  return {
    ok: true,
    data: data as T,
    status: response.status,
  };
}

export async function getNews(): Promise<ApiResult<NewsItemResult>> {
  return fetchFromApi("/news");
}

export async function getNewsItem(slug: string): Promise<ApiResult<NewsItem>> {
  return fetchFromApi(`/news/${slug}`);
}

export async function getAuthors(): Promise<ApiResult<authorsResult>> {
  return fetchFromApi("/authors");
}

export async function createNewsItem(body: unknown): Promise<ApiResult<NewsItem>> {
  return fetchFromApi("/news", {
    method: "POST",
    body,
  });
}
