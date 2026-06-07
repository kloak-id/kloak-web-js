export class PasswordlessAuth {
    http;
    tokens;
    authState;
    constructor(http, tokens, authState) {
        this.http = http;
        this.tokens = tokens;
        this.authState = authState;
    }
    async sendCode(opts) {
        if (!opts.email && !opts.phone) {
            throw new Error('Either email or phone is required');
        }
        return this.http.post('/auth/passwordless/code', {
            ...(opts.email && { email: opts.email }),
            ...(opts.phone && { phone: opts.phone }),
        });
    }
    async consumeCode(opts) {
        if (!opts.email && !opts.phone) {
            throw new Error('Either email or phone is required');
        }
        if (!opts.code && !opts.linkCode) {
            throw new Error('Either code or linkCode is required');
        }
        const res = await this.http.post('/auth/passwordless/consume', {
            ...(opts.email && { email: opts.email }),
            ...(opts.phone && { phone: opts.phone }),
            ...(opts.code && { code: opts.code }),
            ...(opts.linkCode && { link_code: opts.linkCode }),
        });
        this.tokens.set({
            accessToken: res.access_token,
            sessionId: res.session_id,
            expiresAt: Date.now() + res.expires_in * 1000,
        });
        this.authState.set({
            status: 'authenticated',
            user: res.user,
            sessionId: res.session_id,
        });
        return res.user;
    }
}
//# sourceMappingURL=index.js.map