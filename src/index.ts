export type { User, Session, TokenClaims, KloakError } from './types/index.js';
export { KloakWebError } from './http/client.js';
export type { StorageBackend } from './storage/token-store.js';
export type { AuthState, AuthStateListener } from './auth/state.js';
export type { SignInOptions, SignUpOptions, SignInResult } from './auth/email-password.js';
export type { SendOtpOptions, ConsumeOtpOptions } from './passwordless/index.js';
export type { WebAuthnCredential } from './passkey/index.js';
export type { SocialProvider, SocialLoginOptions } from './social/index.js';
export type { TotpEnrollment } from './totp/index.js';

import { HttpClient } from './http/client.js';
import { TokenStore } from './storage/token-store.js';
import { AuthStateManager } from './auth/state.js';
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
}

export class KloakClient {
  readonly emailPassword: EmailPasswordAuth;
  readonly passwordless: PasswordlessAuth;
  readonly passkeys: PasskeyAuth;
  readonly social: SocialAuth;
  readonly totp: TotpAuth;
  readonly sessions: SessionManager;

  private tokenStore: TokenStore;
  private authState: AuthStateManager;

  constructor(public readonly config: KloakClientConfig) {
    const baseUrl = config.baseUrl.replace(/\/$/, '');
    this.tokenStore = new TokenStore(config.storage ?? 'memory');
    this.authState = new AuthStateManager();

    const http = new HttpClient(baseUrl, config.tenantId, () =>
      this.tokenStore.getAccessToken(),
    );

    this.emailPassword = new EmailPasswordAuth(http, this.tokenStore, this.authState);
    this.passwordless = new PasswordlessAuth(http, this.tokenStore, this.authState);
    this.passkeys = new PasskeyAuth(http, this.tokenStore, this.authState);
    this.social = new SocialAuth(baseUrl, config.tenantId);
    this.totp = new TotpAuth(http);
    this.sessions = new SessionManager(http, this.tokenStore, this.authState);

    if (!this.tokenStore.isExpired()) {
      this.authState.set({ status: 'loading' });
    } else {
      this.authState.set({ status: 'unauthenticated' });
    }
  }

  getUser(): User | null {
    return this.authState.getUser();
  }

  getAuthState() {
    return this.authState.get();
  }

  getAccessToken(): string | null {
    return this.tokenStore.getAccessToken();
  }

  getSessionId(): string | null {
    return this.sessions.getSessionId();
  }

  onAuthStateChange(listener: AuthStateListener): () => void {
    return this.authState.subscribe(listener);
  }

  signOut(): Promise<void> {
    return this.sessions.signOut();
  }

  signOutAll(userId: string): Promise<{ revoked: number }> {
    return this.sessions.signOutAll(userId);
  }

  listSessions(userId: string): Promise<Session[]> {
    return this.sessions.list(userId);
  }

  isAuthenticated(): boolean {
    return !this.tokenStore.isExpired() && this.authState.isAuthenticated();
  }
}
