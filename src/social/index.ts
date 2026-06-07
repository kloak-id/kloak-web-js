export type SocialProvider =
  | 'google'
  | 'github'
  | 'facebook'
  | 'discord'
  | 'linkedin'
  | 'microsoft'
  | 'okta'
  | 'apple';

export interface SocialLoginOptions {
  provider: SocialProvider;
  /** Opaque key from the OAuth2 login_challenge flow */
  loginKey?: string;
  /** Where to redirect after social login completes */
  redirectTo?: string;
}

export class SocialAuth {
  constructor(
    private baseUrl: string,
    private tenantId: string,
  ) {}

  /**
   * Redirects the browser to the provider's authorization page.
   * After the user authenticates, the provider redirects back to Kloak.id,
   * which then redirects to your app's redirect_uri with an auth code.
   */
  redirectToProvider(opts: SocialLoginOptions): void {
    const url = new URL(
      `${this.baseUrl}/t/${this.tenantId}/oauth2/social/${opts.provider}`,
    );
    if (opts.loginKey) url.searchParams.set('login_key', opts.loginKey);
    if (opts.redirectTo) url.searchParams.set('redirect_to', opts.redirectTo);
    window.location.href = url.toString();
  }

  /**
   * Returns the callback URL for a given provider.
   * Register this with your social provider's OAuth2 app.
   */
  getCallbackUrl(provider: SocialProvider): string {
    return `${this.baseUrl}/t/${this.tenantId}/oauth2/social/${provider}/callback`;
  }
}
