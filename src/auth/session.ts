import type { HttpClient } from '../http/client.js';
import type { TokenStore } from '../storage/token-store.js';
import type { AuthStateManager } from './state.js';
import type { Session } from '../types/index.js';

export class SessionManager {
  constructor(
    private http: HttpClient,
    private tokens: TokenStore,
    private authState: AuthStateManager,
  ) {}

  async signOut(): Promise<void> {
    const tokens = this.tokens.get();
    if (tokens?.sessionId) {
      try {
        await this.http.delete(`/sessions/${tokens.sessionId}`);
      } catch {
        // best-effort — clear local state regardless
      }
    }
    this.tokens.clear();
    this.authState.set({ status: 'unauthenticated' });
  }

  async signOutAll(userId: string): Promise<{ revoked: number }> {
    const res = await this.http.delete<{ status: string; revoked: number }>('/sessions', {
      user_id: userId,
    });
    this.tokens.clear();
    this.authState.set({ status: 'unauthenticated' });
    return { revoked: res.revoked };
  }

  async list(userId: string): Promise<Session[]> {
    return this.http.get<Session[]>('/sessions', { user_id: userId });
  }

  getSessionId(): string | null {
    return this.tokens.get()?.sessionId ?? null;
  }
}
