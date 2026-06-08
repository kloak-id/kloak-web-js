import type { KloakError } from '../types/index.js';

export class KloakWebError extends Error implements KloakError {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'KloakWebError';
    this.code = code;
    this.status = status;
  }
}

export class HttpClient {
  constructor(
    private baseUrl: string,
    private tenantId: string,
    private useCustomDomain: boolean,
    private getAccessToken: () => string | null,
  ) {}

  private tenantPath(path: string) {
    if (this.useCustomDomain) {
      return `${this.baseUrl}${path}`;
    }
    return `${this.baseUrl}/t/${this.tenantId}${path}`;
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    params?: Record<string, string>,
  ): Promise<T> {
    const fullUrl = new URL(url);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        fullUrl.searchParams.set(k, v);
      }
    }

    const token = this.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(fullUrl.toString(), {
      method,
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    if (res.status === 204) return undefined as T;

    const data = await res.json();

    if (!res.ok) {
      throw new KloakWebError(
        (data as { error?: string }).error ?? 'unknown_error',
        (data as { error_description?: string }).error_description ?? res.statusText,
        res.status,
      );
    }

    return data as T;
  }

  get<T>(path: string, params?: Record<string, string>) {
    return this.request<T>('GET', this.tenantPath(path), undefined, params);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', this.tenantPath(path), body);
  }

  delete<T>(path: string, body?: unknown) {
    return this.request<T>('DELETE', this.tenantPath(path), body);
  }
}
