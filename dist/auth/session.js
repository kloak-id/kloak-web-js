export class SessionManager {
    http;
    tokens;
    authState;
    constructor(http, tokens, authState) {
        this.http = http;
        this.tokens = tokens;
        this.authState = authState;
    }
    async signOut() {
        const tokens = this.tokens.get();
        if (tokens?.sessionId) {
            try {
                await this.http.delete(`/sessions/${tokens.sessionId}`);
            }
            catch {
                // best-effort — clear local state regardless
            }
        }
        this.tokens.clear();
        this.authState.set({ status: 'unauthenticated' });
    }
    async signOutAll(userId) {
        const res = await this.http.delete('/sessions', {
            user_id: userId,
        });
        this.tokens.clear();
        this.authState.set({ status: 'unauthenticated' });
        return { revoked: res.revoked };
    }
    async list(userId) {
        return this.http.get('/sessions', { user_id: userId });
    }
    getSessionId() {
        return this.tokens.get()?.sessionId ?? null;
    }
}
//# sourceMappingURL=session.js.map