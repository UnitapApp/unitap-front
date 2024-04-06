export type WithPagination<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};
