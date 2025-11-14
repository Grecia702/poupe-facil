export interface MetaData {
    total: number,
    page: number,
    limit: number,
    hasNextPage: boolean
}

export interface PaginatedData<T> {
    data: T[]
    meta: MetaData
}