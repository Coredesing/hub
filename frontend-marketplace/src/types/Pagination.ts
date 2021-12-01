export type PaginationResult = {
    data: { [k: string]: any }[],
    lastPage: number,
    page: number,
    perPage: number,
    total: number
}