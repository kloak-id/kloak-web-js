export interface StoredTokens {
    accessToken: string;
    refreshToken?: string;
    sessionId: string;
    expiresAt: number;
}
export type StorageBackend = 'memory' | 'localStorage' | 'sessionStorage';
/**
 * Stores auth tokens. Defaults to in-memory for security.
 * Use 'localStorage' only when you need tokens to survive page refreshes.
 *
 * Never stores tokens in a cookie — use HttpOnly cookies server-side instead.
 */
export declare class TokenStore {
    private memory;
    private backend;
    constructor(backend?: StorageBackend);
    set(tokens: StoredTokens): void;
    get(): StoredTokens | null;
    clear(): void;
    isExpired(): boolean;
    getAccessToken(): string | null;
}
//# sourceMappingURL=token-store.d.ts.map