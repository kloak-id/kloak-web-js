export class AuthStateManager {
    state = { status: 'loading' };
    listeners = new Set();
    get() {
        return this.state;
    }
    set(next) {
        this.state = next;
        for (const listener of this.listeners) {
            listener(next);
        }
    }
    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.state);
        return () => this.listeners.delete(listener);
    }
    isAuthenticated() {
        return this.state.status === 'authenticated';
    }
    getUser() {
        return this.state.status === 'authenticated' ? this.state.user : null;
    }
}
//# sourceMappingURL=state.js.map