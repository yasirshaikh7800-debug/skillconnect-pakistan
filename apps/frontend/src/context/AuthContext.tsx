'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { UserRole, UserProfile, ProviderProfile } from '@/lib/types';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
  providerProfile?: ProviderProfile;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResult extends AuthTokens {
  user: AuthUser;
}

interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
  providerProfile?: ProviderProfile;
  wallet?: {
    balance: number;
    currency: string;
  };
}

interface Login2FAResult {
  requires2FA: true;
  message: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
  phone?: string;
  role: UserRole;
  cnicNumber?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<Login2FAResult | AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'scpk_token';
const REFRESH_KEY = 'scpk_refresh';
const USER_KEY = 'scpk_user';

function persistSession(result: LoginResult) {
  localStorage.setItem(TOKEN_KEY, result.accessToken);
  localStorage.setItem(REFRESH_KEY, result.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));
}

async function fetchUserProfile(): Promise<AuthUser | null> {
  try {
    const userResponse = await api<UserResponse>('/users/me');
    return {
      id: userResponse.id,
      email: userResponse.email,
      role: userResponse.role,
      profile: userResponse.profile,
      providerProfile: userResponse.providerProfile,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (stored && token) {
      try {
        const parsedUser = JSON.parse(stored) as AuthUser;
        setUser(parsedUser);
        void fetchUserProfile().then((freshUser) => {
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          }
        });
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, twoFactorCode?: string) => {
    const result = await api<LoginResult | Login2FAResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, ...(twoFactorCode ? { twoFactorCode } : {}) }),
    });

    if ('requires2FA' in result && result.requires2FA) {
      return result;
    }

    const session = result as LoginResult;
    persistSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await api<LoginResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    persistSession(result);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
