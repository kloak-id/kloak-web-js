import type { HttpClient } from '../http/client.js';
import type { TokenStore } from '../storage/token-store.js';
import type { AuthStateManager } from './state.js';
import type { User } from '../types/index.js';
export interface SignInResult {
    user?: User;
    mfaRequired?: boolean;
    mfaMethod?: string;
    mfaToken?: string;
}
export interface SignUpOptions {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export interface SignInOptions {
    email: string;
    password: string;
}
export declare class EmailPasswordAuth {
    private http;
    private tokens;
    private authState;
    constructor(http: HttpClient, tokens: TokenStore, authState: AuthStateManager);
    signUp(opts: SignUpOptions): Promise<User>;
    signIn(opts: SignInOptions): Promise<SignInResult>;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=email-password.d.ts.map