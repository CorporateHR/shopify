export interface GetRequestParams {
  page?: string;
  limit?: string;
  query?: string;
  // Allow additional parameters
  [key: string]: string | string[] | undefined;
}

export interface RequestOptions {
  params?: Record<string, string | number>;
}
