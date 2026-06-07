import type { HttpClient } from '../http/client.js';
import type { TokenStore } from '../storage/token-store.js';
import type { AuthStateManager } from '../auth/state.js';
import type { User } from '../types/index.js';
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
export declare class PasswordlessAuth {
    private http;
    private tokens;
    private authState;
    constructor(http: HttpClient, tokens: TokenStore, authState: AuthStateManager);
    sendCode(opts: SendOtpOptions): Promise<SendCodeResponse>;
    consumeCode(opts: ConsumeOtpOptions): Promise<User>;
}
export {};
//# sourceMappingURL=index.d.ts.map