export type SocialProvider = 'google' | 'github' | 'facebook' | 'discord' | 'linkedin' | 'microsoft' | 'okta' | 'apple';
export interface SocialLoginOptions {
    provider: SocialProvider;
    /** Opaque key from the OAuth2 login_challenge flow */
    loginKey?: string;
    /** Where to redirect after social login completes */
    redirectTo?: string;
}
export declare class SocialAuth {
    private baseUrl;
    private tenantId;
    private useCustomDomain;
    constructor(baseUrl: string, tenantId: string, useCustomDomain: boolean);
    private tenantPath;
    /**
     * Redirects the browser to the provider's authorization page.
     * After the user authenticates, the provider redirects back to Kloak.id,
     * which then redirects to your app's redirect_uri with an auth code.
     */
    redirectToProvider(opts: SocialLoginOptions): void;
    /**
     * Returns the callback URL for a given provider.
     * Register this with your social provider's OAuth2 app.
     */
    getCallbackUrl(provider: SocialProvider): string;
}
//# sourceMappingURL=index.d.ts.map