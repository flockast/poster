import type { SortByRequest } from '@/application/common/type'

type Sort<T extends string> = `${T}.${'asc' | 'desc'}` | T

export const decodeSort = <T extends string>(sort: Sort<T>[]): SortByRequest<Record<T, unknown>> =>
  sort.map((s) => {
    const [field, order] = s.split('.')
    return [field, order ?? 'asc' as const] as [keyof Record<T, unknown>, 'asc' | 'desc']
  })
