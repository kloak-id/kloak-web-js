import type { HttpClient } from '../http/client.js';
export interface TotpEnrollment {
    secret: string;
    otpauth: string;
    issuer: string;
    account: string;
}
export declare class TotpAuth {
    private http;
    constructor(http: HttpClient);
    enroll(userId: string): Promise<TotpEnrollment>;
    /** Call after user scans QR code to confirm enrollment */
    verify(userId: string, code: string): Promise<{
        status: string;
        mfaMethod: string;
    }>;
    /** Call during login to validate the current TOTP code */
    validate(userId: string, code: string): Promise<{
        valid: boolean;
    }>;
    disable(userId: string): Promise<{
        status: string;
    }>;
}
//# sourceMappingURL=index.d.ts.map