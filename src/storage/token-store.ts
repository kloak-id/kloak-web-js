export interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
  sessionId: string;
  expiresAt: number; // unix timestamp ms
}

export type StorageBackend = 'memory' | 'localStorage' | 'sessionStorage';

const STORAGE_KEY = '__kloak_tokens__';

/**
 * Stores auth tokens. Defaults to in-memory for security.
 * Use 'localStorage' only when you need tokens to survive page refreshes.
 *
 * Never stores tokens in a cookie — use HttpOnly cookies server-side instead.
 */
export class TokenStore {
  private memory: StoredTokens | null = null;
  private backend: StorageBackend;

  constructor(backend: StorageBackend = 'memory') {
    this.backend = backend;
  }

  set(tokens: StoredTokens): void {
    this.memory = tokens;
    if (this.backend === 'localStorage') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } else if (this.backend === 'sessionStorage') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }
  }

  get(): StoredTokens | null {
    if (this.backend === 'localStorage') {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredTokens) : null;
    }
    if (this.backend === 'sessionStorage') {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredTokens) : null;
    }
    return this.memory;
  }

  clear(): void {
    this.memory = null;
    if (this.backend === 'localStorage') {
      localStorage.removeItem(STORAGE_KEY);
    } else if (this.backend === 'sessionStorage') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  isExpired(): boolean {
    const tokens = this.get();
    if (!tokens) return true;
    return Date.now() >= tokens.expiresAt;
  }

  getAccessToken(): string | null {
    return this.get()?.accessToken ?? null;
  }
}
