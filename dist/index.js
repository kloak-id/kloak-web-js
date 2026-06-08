export { KloakWebError } from './http/client.js';
import { HttpClient } from './http/client.js';
import { TokenStore } from './storage/token-store.js';
import { AuthStateManager } from './auth/state.js';
import { EmailPasswordAuth } from './auth/email-password.js';
import { SessionManager } from './auth/session.js';
import { PasswordlessAuth } from './passwordless/index.js';
import { PasskeyAuth } from './passkey/index.js';
import { SocialAuth } from './social/index.js';
import { TotpAuth } from './totp/index.js';
export class KloakClient {
    config;
    emailPassword;
    passwordless;
    passkeys;
    social;
    totp;
    sessions;
    tokenStore;
    authState;
    constructor(config) {
        this.config = config;
        const baseUrl = config.baseUrl.replace(/\/$/, '');
        this.tokenStore = new TokenStore(config.storage ?? 'memory');
        this.authState = new AuthStateManager();
        const http = new HttpClient(baseUrl, config.tenantId, !!config.useCustomDomain, () => this.tokenStore.getAccessToken());
        this.emailPassword = new EmailPasswordAuth(http, this.tokenStore, this.authState);
        this.passwordless = new PasswordlessAuth(http, this.tokenStore, this.authState);
        this.passkeys = new PasskeyAuth(http, this.tokenStore, this.authState);
        this.social = new SocialAuth(baseUrl, config.tenantId, !!config.useCustomDomain);
        this.totp = new TotpAuth(http);
        this.sessions = new SessionManager(http, this.tokenStore, this.authState);
        if (!this.tokenStore.isExpired()) {
            this.authState.set({ status: 'loading' });
        }
        else {
            this.authState.set({ status: 'unauthenticated' });
        }
    }
    getUser() {
        return this.authState.getUser();
    }
    getAuthState() {
        return this.authState.get();
    }
    getAccessToken() {
        return this.tokenStore.getAccessToken();
    }
    getSessionId() {
        return this.sessions.getSessionId();
    }
    onAuthStateChange(listener) {
        return this.authState.subscribe(listener);
    }
    signOut() {
        return this.sessions.signOut();
    }
    signOutAll(userId) {
        return this.sessions.signOutAll(userId);
    }
    listSessions(userId) {
        return this.sessions.list(userId);
    }
    isAuthenticated() {
        return !this.tokenStore.isExpired() && this.authState.isAuthenticated();
    }
}
//# sourceMappingURL=index.js.map