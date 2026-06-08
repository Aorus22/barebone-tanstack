import { z } from "zod"

export const serverListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  perPage: z.coerce.number().int().min(1).max(200).catch(20),
  search: z.string().catch(""),
  sort: z.string().catch("createdAt.desc"),
})

export type ServerListQuery = z.infer<typeof serverListQuerySchema>

export type PaginatedResult<TItem> = {
  items: Array<TItem>
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export function parseServerListQuery(input: unknown): ServerListQuery {
  return serverListQuerySchema.parse(input)
}
