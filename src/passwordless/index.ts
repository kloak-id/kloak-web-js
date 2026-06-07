import type { HttpClient } from '../http/client.js';
import type { TokenStore } from '../storage/token-store.js';
import type { AuthStateManager } from '../auth/state.js';
import type { User } from '../types/index.js';

interface AuthResponse {
  user: User;
  access_token: string;
  expires_in: number;
  session_id: string;
}

interface SendCodeResponse {
  expires_in: string;
  /** Only present in dev/console-mailer mode */
  code?: string;
  link_code?: string;
}

export interface SendOtpOptions {
  email?: string;
  phone?: string;
}

export interface ConsumeOtpOptions {
  email?: string;
  phone?: string;
  code?: string;
  linkCode?: string;
}

export class PasswordlessAuth {
  constructor(
    private http: HttpClient,
    private tokens: TokenStore,
    private authState: AuthStateManager,
  ) {}

  async sendCode(opts: SendOtpOptions): Promise<SendCodeResponse> {
    if (!opts.email && !opts.phone) {
      throw new Error('Either email or phone is required');
    }
    return this.http.post<SendCodeResponse>('/auth/passwordless/code', {
      ...(opts.email && { email: opts.email }),
      ...(opts.phone && { phone: opts.phone }),
    });
  }

  async consumeCode(opts: ConsumeOtpOptions): Promise<User> {
    if (!opts.email && !opts.phone) {
      throw new Error('Either email or phone is required');
    }
    if (!opts.code && !opts.linkCode) {
      throw new Error('Either code or linkCode is required');
    }

    const res = await this.http.post<AuthResponse>('/auth/passwordless/consume', {
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
