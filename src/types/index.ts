// Shared types for @kloak.id/web — do not import from @kloak.id/node in browser code.

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  role: 'admin' | 'operator' | 'user' | 'viewer';
  isActive: boolean;
  isEmailVerified: boolean;
  mfaMethod?: 'totp';
  failedLoginAttempts: number;
  lockedUntil?: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  tenantId: string;
  userId: string;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface TokenClaims {
  sub: string;
  tenantId: string;
  email?: string;
  role?: string;
  sessionId?: string;
  iss: string;
  aud?: string | string[];
  exp: number;
  iat: number;
}

export interface KloakError extends Error {
  code: string;
  status: number;
}
