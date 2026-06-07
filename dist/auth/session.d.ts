import type { HttpClient } from '../http/client.js';
import type { TokenStore } from '../storage/token-store.js';
import type { AuthStateManager } from './state.js';
import type { Session } from '../types/index.js';
export declare class SessionManager {
    private http;
    private tokens;
    private authState;
    constructor(http: HttpClient, tokens: TokenStore, authState: AuthStateManager);
    signOut(): Promise<void>;
    signOutAll(userId: string): Promise<{
        revoked: number;
    }>;
    list(userId: string): Promise<Session[]>;
    getSessionId(): string | null;
}
//# sourceMappingURL=session.d.ts.map