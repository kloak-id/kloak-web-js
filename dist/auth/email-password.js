export class EmailPasswordAuth {
    http;
    tokens;
    authState;
    constructor(http, tokens, authState) {
        this.http = http;
        this.tokens = tokens;
        this.authState = authState;
    }
    async signUp(opts) {
        const res = await this.http.post('/auth/signup', {
            email: opts.email,
            password: opts.password,
            first_name: opts.firstName,
            last_name: opts.lastName,
        });
        return res;
    }
    async signIn(opts) {
        const res = await this.http.post('/auth/signin', {
            email: opts.email,
            password: opts.password,
        });
        if (res.mfa_required) {
            return {
                mfaRequired: true,
                mfaMethod: res.mfa_method,
                mfaToken: res.mfa_token,
            };
        }
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
        return { user: res.user };
    }
    async requestPasswordReset(email) {
        await this.http.post('/auth/password/reset/token', { email });
    }
    async resetPassword(token, newPassword) {
        await this.http.post('/auth/password/reset', {
            token,
            new_password: newPassword,
        });
    }
}
//# sourceMappingURL=email-password.js.map