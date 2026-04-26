/**
 * Data Envelopes are a standard way to wrap API responses with additional metadata such as success status and messages.
 * This allows for consistent handling of API responses across the application.
 */

export type DataEnvelope<T> = {
    data: T;
    isSuccess: boolean;
    message?: string;
};

export type DataListEnvelope<T> = DataEnvelope<T[]> & {
    total:number;
};

export type PagingRequest = {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    descending?: boolean;
};