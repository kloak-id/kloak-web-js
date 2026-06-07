import type { User } from '../types/index.js';
export type AuthState = {
    status: 'loading';
} | {
    status: 'authenticated';
    user: User;
    sessionId: string;
} | {
    status: 'unauthenticated';
};
export type AuthStateListener = (state: AuthState) => void;
export declare class AuthStateManager {
    private state;
    private listeners;
    get(): AuthState;
    set(next: AuthState): void;
    subscribe(listener: AuthStateListener): () => void;
    isAuthenticated(): boolean;
    getUser(): User | null;
}
//# sourceMappingURL=state.d.ts.map