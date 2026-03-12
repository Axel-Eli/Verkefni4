
export type NewsAuthor = {
  name: string;
};

export type NewsItemResult = {
  data: Array<NewsItem>;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  intro: string;
  author: NewsAuthor;
  text?: string;
};

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

export type ApiResult<T> =
  | {
      data: T;
      ok: true;
      status: number;
    }
  | {
      ok: false;
      reason: "error" | "not-found" | "validation";
      status?: number;
      error: ApiError;
    };

export type NewsState = "initial" | "loading" | "error" | "data" | "empty";
