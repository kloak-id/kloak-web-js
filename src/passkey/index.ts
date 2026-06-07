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

interface BeginResponse {
  challenge_id: string;
  options: PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions;
}

export interface WebAuthnCredential {
  id: string;
  signCount: number;
  transport: string[];
  createdAt: string;
}

export class PasskeyAuth {
  constructor(
    private http: HttpClient,
    private tokens: TokenStore,
    private authState: AuthStateManager,
  ) {}

  async register(userId: string): Promise<{ credentialId: string }> {
    const begin = await this.http.post<BeginResponse>('/auth/webauthn/register/begin', {
      user_id: userId,
    });

    const credential = await navigator.credentials.create({
      publicKey: begin.options as PublicKeyCredentialCreationOptions,
    });

    if (!credential) throw new Error('Passkey registration was cancelled');

    const res = await this.http.post<{ status: string; credential_id: string }>(
      `/auth/webauthn/register/finish?challenge_id=${begin.challenge_id}&user_id=${userId}`,
      credential,
    );

    return { credentialId: res.credential_id };
  }

  async authenticate(userId: string): Promise<User> {
    const begin = await this.http.post<BeginResponse>('/auth/webauthn/authenticate/begin', {
      user_id: userId,
    });

    const assertion = await navigator.credentials.get({
      publicKey: begin.options as PublicKeyCredentialRequestOptions,
    });

    if (!assertion) throw new Error('Passkey authentication was cancelled');

    const res = await this.http.post<AuthResponse>(
      `/auth/webauthn/authenticate/finish?challenge_id=${begin.challenge_id}&user_id=${userId}`,
      assertion,
    );

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

  listCredentials(userId: string): Promise<WebAuthnCredential[]> {
    return this.http.get<WebAuthnCredential[]>('/auth/webauthn/credentials', {
      user_id: userId,
    });
  }

  deleteCredential(credentialId: string): Promise<void> {
    return this.http.delete(`/auth/webauthn/credentials/${credentialId}`);
  }
}
