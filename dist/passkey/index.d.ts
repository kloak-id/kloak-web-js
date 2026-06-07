import type { HttpClient } from '../http/client.js';
import type { TokenStore } from '../storage/token-store.js';
import type { AuthStateManager } from '../auth/state.js';
import type { User } from '../types/index.js';
export interface WebAuthnCredential {
    id: string;
    signCount: number;
    transport: string[];
    createdAt: string;
}
export declare class PasskeyAuth {
    private http;
    private tokens;
    private authState;
    constructor(http: HttpClient, tokens: TokenStore, authState: AuthStateManager);
    register(userId: string): Promise<{
        credentialId: string;
    }>;
    authenticate(userId: string): Promise<User>;
    listCredentials(userId: string): Promise<WebAuthnCredential[]>;
    deleteCredential(credentialId: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map