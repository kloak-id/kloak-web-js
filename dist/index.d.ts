export type { User, Session, TokenClaims, KloakError } from './types/index.js';
export { KloakWebError } from './http/client.js';
export type { StorageBackend } from './storage/token-store.js';
export type { AuthState, AuthStateListener } from './auth/state.js';
export type { SignInOptions, SignUpOptions, SignInResult } from './auth/email-password.js';
export type { SendOtpOptions, ConsumeOtpOptions } from './passwordless/index.js';
export type { WebAuthnCredential } from './passkey/index.js';
export type { SocialProvider, SocialLoginOptions } from './social/index.js';
export type { TotpEnrollment } from './totp/index.js';
import { EmailPasswordAuth } from './auth/email-password.js';
import { SessionManager } from './auth/session.js';
import { PasswordlessAuth } from './passwordless/index.js';
import { PasskeyAuth } from './passkey/index.js';
import { SocialAuth } from './social/index.js';
import { TotpAuth } from './totp/index.js';
import type { StorageBackend } from './storage/token-store.js';
import type { AuthStateListener } from './auth/state.js';
import type { User, Session } from './types/index.js';
export interface KloakClientConfig {
    baseUrl: string;
    tenantId: string;
    /**
     * Where to store auth tokens.
     * - 'memory' (default) — most secure, tokens lost on page refresh
     * - 'sessionStorage' — survives navigation, cleared when tab closes
     * - 'localStorage' — persists across sessions, use with caution
     */
    storage?: StorageBackend;
    /**
     * Set to true if baseUrl points to a custom domain (e.g. auth.acme.com)
     * instead of the generic platform domain. This alters SDK path generation.
     */
    useCustomDomain?: boolean;
}
export declare class KloakClient {
    readonly config: KloakClientConfig;
    readonly emailPassword: EmailPasswordAuth;
    readonly passwordless: PasswordlessAuth;
    readonly passkeys: PasskeyAuth;
    readonly social: SocialAuth;
    readonly totp: TotpAuth;
    readonly sessions: SessionManager;
    private tokenStore;
    private authState;
    constructor(config: KloakClientConfig);
    getUser(): User | null;
    getAuthState(): import("./auth/state.js").AuthState;
    getAccessToken(): string | null;
    getSessionId(): string | null;
    onAuthStateChange(listener: AuthStateListener): () => void;
    signOut(): Promise<void>;
    signOutAll(userId: string): Promise<{
        revoked: number;
    }>;
    listSessions(userId: string): Promise<Session[]>;
    isAuthenticated(): boolean;
}
//# sourceMappingURL=index.d.ts.map