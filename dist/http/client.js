export class KloakWebError extends Error {
    code;
    status;
    constructor(code, message, status) {
        super(message);
        this.name = 'KloakWebError';
        this.code = code;
        this.status = status;
    }
}
export class HttpClient {
    baseUrl;
    tenantId;
    useCustomDomain;
    getAccessToken;
    constructor(baseUrl, tenantId, useCustomDomain, getAccessToken) {
        this.baseUrl = baseUrl;
        this.tenantId = tenantId;
        this.useCustomDomain = useCustomDomain;
        this.getAccessToken = getAccessToken;
    }
    tenantPath(path) {
        if (this.useCustomDomain) {
            return `${this.baseUrl}${path}`;
        }
        return `${this.baseUrl}/t/${this.tenantId}${path}`;
    }
    async request(method, url, body, params) {
        const fullUrl = new URL(url);
        if (params) {
            for (const [k, v] of Object.entries(params)) {
                fullUrl.searchParams.set(k, v);
            }
        }
        const token = this.getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
        const res = await fetch(fullUrl.toString(), {
            method,
            headers,
            ...(body !== undefined && { body: JSON.stringify(body) }),
        });
        if (res.status === 204)
            return undefined;
        const data = await res.json();
        if (!res.ok) {
            throw new KloakWebError(data.error ?? 'unknown_error', data.error_description ?? res.statusText, res.status);
        }
        return data;
    }
    get(path, params) {
        return this.request('GET', this.tenantPath(path), undefined, params);
    }
    post(path, body) {
        return this.request('POST', this.tenantPath(path), body);
    }
    delete(path, body) {
        return this.request('DELETE', this.tenantPath(path), body);
    }
}
//# sourceMappingURL=client.js.map