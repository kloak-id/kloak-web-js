import type { KloakError } from '../types/index.js';
export declare class KloakWebError extends Error implements KloakError {
    code: string;
    status: number;
    constructor(code: string, message: string, status: number);
}
export declare class HttpClient {
    private baseUrl;
    private tenantId;
    private useCustomDomain;
    private getAccessToken;
    constructor(baseUrl: string, tenantId: string, useCustomDomain: boolean, getAccessToken: () => string | null);
    private tenantPath;
    private request;
    get<T>(path: string, params?: Record<string, string>): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    delete<T>(path: string, body?: unknown): Promise<T>;
}
//# sourceMappingURL=client.d.ts.map