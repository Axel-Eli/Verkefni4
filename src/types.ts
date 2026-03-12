
export type NewsAuthor = {
  id: number;
  name: string;
  email?: string;
};

export type NewsItemResult = {
  data: Array<NewsItem>;
  paging?: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  intro: string;
  author: NewsAuthor | null;
  text?: string;
  puplished?: string;
  authorId?: number; 
};

export type authorsResult = {
  data: Array<NewsAuthor>;
  paging?: {
    limit: number;
    offset: number;
    total: number;
  };
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
