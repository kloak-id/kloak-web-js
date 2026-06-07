export class TotpAuth {
    http;
    constructor(http) {
        this.http = http;
    }
    enroll(userId) {
        return this.http.post('/auth/totp/enroll', { user_id: userId });
    }
    /** Call after user scans QR code to confirm enrollment */
    verify(userId, code) {
        return this.http.post('/auth/totp/verify', { user_id: userId, code });
    }
    /** Call during login to validate the current TOTP code */
    validate(userId, code) {
        return this.http.post('/auth/totp/validate', { user_id: userId, code });
    }
    disable(userId) {
        return this.http.post('/auth/totp/disable', { user_id: userId });
    }
}
//# sourceMappingURL=index.js.map