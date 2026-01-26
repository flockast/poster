export type PaginationRequest = {
  offset: number
  limit: number
}

export type PaginationResponse<T> = {
  total: number
  data: T[]
}

export type SortByRequest<T extends object> = Array<[keyof T, ('asc' | 'desc')?]>
