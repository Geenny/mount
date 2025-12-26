import axios, { AxiosInstance } from 'axios';

export class Http {
  private axiosInstance: AxiosInstance;

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data);
    return response.data;
  }
}

export const http = new Http();