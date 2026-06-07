import type { HttpClient } from '../http/client.js';
import type { TokenStore } from '../storage/token-store.js';
import type { AuthStateManager } from './state.js';
import type { User } from '../types/index.js';

interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in?: number;
  session_id?: string;
  mfa_required?: boolean;
  mfa_method?: string;
  mfa_token?: string;
}

export interface SignInResult {
  user?: User;
  mfaRequired?: boolean;
  mfaMethod?: string;
  mfaToken?: string;
}

export interface SignUpOptions {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInOptions {
  email: string;
  password: string;
}

export class EmailPasswordAuth {
  constructor(
    private http: HttpClient,
    private tokens: TokenStore,
    private authState: AuthStateManager,
  ) {}

  async signUp(opts: SignUpOptions): Promise<User> {
    const res = await this.http.post<User>('/auth/signup', {
      email: opts.email,
      password: opts.password,
      first_name: opts.firstName,
      last_name: opts.lastName,
    });
    return res;
  }

  async signIn(opts: SignInOptions): Promise<SignInResult> {
    const res = await this.http.post<AuthResponse>('/auth/signin', {
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
      accessToken: res.access_token!,
      sessionId: res.session_id!,
      expiresAt: Date.now() + res.expires_in! * 1000,
    });

    this.authState.set({
      status: 'authenticated',
      user: res.user!,
      sessionId: res.session_id!,
    });

    return { user: res.user! };
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.http.post('/auth/password/reset/token', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.http.post('/auth/password/reset', {
      token,
      new_password: newPassword,
    });
  }
}
