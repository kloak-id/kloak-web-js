export class SocialAuth {
    baseUrl;
    tenantId;
    constructor(baseUrl, tenantId) {
        this.baseUrl = baseUrl;
        this.tenantId = tenantId;
    }
    /**
     * Redirects the browser to the provider's authorization page.
     * After the user authenticates, the provider redirects back to Kloak.id,
     * which then redirects to your app's redirect_uri with an auth code.
     */
    redirectToProvider(opts) {
        const url = new URL(`${this.baseUrl}/t/${this.tenantId}/oauth2/social/${opts.provider}`);
        if (opts.loginKey)
            url.searchParams.set('login_key', opts.loginKey);
        if (opts.redirectTo)
            url.searchParams.set('redirect_to', opts.redirectTo);
        window.location.href = url.toString();
    }
    /**
     * Returns the callback URL for a given provider.
     * Register this with your social provider's OAuth2 app.
     */
    getCallbackUrl(provider) {
        return `${this.baseUrl}/t/${this.tenantId}/oauth2/social/${provider}/callback`;
    }
}
//# sourceMappingURL=index.js.map