import type { User } from '../types/index.js';

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User; sessionId: string }
  | { status: 'unauthenticated' };

export type AuthStateListener = (state: AuthState) => void;

export class AuthStateManager {
  private state: AuthState = { status: 'loading' };
  private listeners = new Set<AuthStateListener>();

  get(): AuthState {
    return this.state;
  }

  set(next: AuthState): void {
    this.state = next;
    for (const listener of this.listeners) {
      listener(next);
    }
  }

  subscribe(listener: AuthStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  isAuthenticated(): boolean {
    return this.state.status === 'authenticated';
  }

  getUser(): User | null {
    return this.state.status === 'authenticated' ? this.state.user : null;
  }
}
