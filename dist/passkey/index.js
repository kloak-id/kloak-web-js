export class PasskeyAuth {
    http;
    tokens;
    authState;
    constructor(http, tokens, authState) {
        this.http = http;
        this.tokens = tokens;
        this.authState = authState;
    }
    async register(userId) {
        const begin = await this.http.post('/auth/webauthn/register/begin', {
            user_id: userId,
        });
        const credential = await navigator.credentials.create({
            publicKey: begin.options,
        });
        if (!credential)
            throw new Error('Passkey registration was cancelled');
        const res = await this.http.post(`/auth/webauthn/register/finish?challenge_id=${begin.challenge_id}&user_id=${userId}`, credential);
        return { credentialId: res.credential_id };
    }
    async authenticate(userId) {
        const begin = await this.http.post('/auth/webauthn/authenticate/begin', {
            user_id: userId,
        });
        const assertion = await navigator.credentials.get({
            publicKey: begin.options,
        });
        if (!assertion)
            throw new Error('Passkey authentication was cancelled');
        const res = await this.http.post(`/auth/webauthn/authenticate/finish?challenge_id=${begin.challenge_id}&user_id=${userId}`, assertion);
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
    listCredentials(userId) {
        return this.http.get('/auth/webauthn/credentials', {
            user_id: userId,
        });
    }
    deleteCredential(credentialId) {
        return this.http.delete(`/auth/webauthn/credentials/${credentialId}`);
    }
}
//# sourceMappingURL=index.js.map