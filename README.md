# @kloak.id/web

The official vanilla JavaScript client SDK for Kloak.id. 

If you are using React or React Native, you should use `@kloak.id/react` or `@kloak.id/react-native` instead, as they provide ready-to-use hooks and UI components built on top of this core library. 

Use this library if you are building an app with Vue, Svelte, Angular, Vanilla JS, or a custom frontend framework.

## Installation

```bash
npm install @kloak.id/web
```

## Setup

Initialize the client with your Kloak instance URL and your Tenant ID. 

```typescript
import { KloakClient } from '@kloak.id/web';

export const kloak = new KloakClient({
  baseUrl: 'https://auth.yourdomain.com',
  tenantId: 'default', // Or your specific tenant ID
  storage: 'sessionStorage' // 'memory' (default), 'sessionStorage', or 'localStorage'
});
```

## Examples

### Email & Password Authentication

```typescript
// Sign Up
const user = await kloak.emailPassword.signUp({
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'John'
});

// Sign In
const session = await kloak.emailPassword.signIn({
  email: 'test@example.com',
  password: 'Password123!'
});

console.log('Logged in user:', session.user);
```

### Email Verification

When a user clicks the magic link in their email, grab the token from the URL and verify it:

```typescript
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (token) {
  try {
    await kloak.emailPassword.verifyEmail(token);
    alert('Email successfully verified!');
  } catch (err) {
    alert('Verification failed or link expired.');
  }
}
```

### Subscribing to Auth State

You can listen for changes to the user's authentication state across your application.

```typescript
const unsubscribe = kloak.onAuthStateChange((state) => {
  if (state.status === 'authenticated') {
    console.log('User is logged in:', state.user);
  } else if (state.status === 'unauthenticated') {
    console.log('User logged out');
  }
});

// Later, when unmounting:
// unsubscribe();
```

## License
Apache 2.0
