import type { HttpClient } from '../http/client.js';

export interface TotpEnrollment {
  secret: string;
  otpauth: string;
  issuer: string;
  account: string;
}

export class TotpAuth {
  constructor(private http: HttpClient) {}

  enroll(userId: string): Promise<TotpEnrollment> {
    return this.http.post<TotpEnrollment>('/auth/totp/enroll', { user_id: userId });
  }

  /** Call after user scans QR code to confirm enrollment */
  verify(userId: string, code: string): Promise<{ status: string; mfaMethod: string }> {
    return this.http.post('/auth/totp/verify', { user_id: userId, code });
  }

  /** Call during login to validate the current TOTP code */
  validate(userId: string, code: string): Promise<{ valid: boolean }> {
    return this.http.post('/auth/totp/validate', { user_id: userId, code });
  }

  disable(userId: string): Promise<{ status: string }> {
    return this.http.post('/auth/totp/disable', { user_id: userId });
  }
}
