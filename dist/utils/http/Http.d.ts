import { AxiosInstance } from 'axios';
export declare class Http {
    private axiosInstance;
    constructor(baseURL?: string);
    get instance(): AxiosInstance;
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: any): Promise<T>;
}
export declare const http: Http;
