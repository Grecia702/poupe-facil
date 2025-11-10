interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
}

interface ApiSuccess<T> {
    data?: T;
    meta?: PaginationMeta;
}

interface ApiError {
    message: string;
    error: string;
    details?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError