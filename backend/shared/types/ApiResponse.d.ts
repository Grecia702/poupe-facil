export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
}

export interface ApiSuccess<T> {
    success: true;
    data: T;
    meta?: PaginationMeta;
}

export interface ApiError {
    success: false;
    message: string;
    error?: string;
    details?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
