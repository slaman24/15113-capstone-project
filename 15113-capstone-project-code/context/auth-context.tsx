import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { hashPassword } from '@/lib/hash';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/lib/storage';
import { seedIfNeeded } from '@/lib/seed';
import type { Role, User } from '@/lib/types';

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

function validateUsername(username: string): string | null {
  if (!username) return 'Username is required.';
  if (username.length < 3 || username.length > 30)
    return 'Username must be 3–30 characters.';
  if (!USERNAME_RE.test(username))
    return 'Username may only contain letters, numbers, and underscores.';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  return null;
}

// ─── Context types ──────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    confirmPassword: string,
    role: Role,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await seedIfNeeded();
        const sessionId = await getItem<string>(STORAGE_KEYS.SESSION);
        if (sessionId) {
          const users = await getItem<User[]>(STORAGE_KEYS.USERS);
          const found = users?.find((u) => u.id === sessionId) ?? null;
          if (!cancelled) setUser(found);
        }
      } catch {
        // session read failure is non-fatal; user stays null
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const usernameError = validateUsername(trimmedUsername);
    if (usernameError) throw new Error(usernameError);

    const passwordError = validatePassword(trimmedPassword);
    if (passwordError) throw new Error(passwordError);

    let users: User[] | null;
    try {
      users = await getItem<User[]>(STORAGE_KEYS.USERS);
    } catch {
      throw new Error('Something went wrong. Please try again.');
    }

    const found = (users ?? []).find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase(),
    );
    if (!found) throw new Error('Incorrect username or password.');

    const hash = await hashPassword(trimmedPassword);
    if (hash !== found.passwordHash)
      throw new Error('Incorrect username or password.');

    try {
      await setItem(STORAGE_KEYS.SESSION, found.id);
    } catch {
      throw new Error('Something went wrong. Please try again.');
    }

    setUser(found);
  }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
      confirmPassword: string,
      role: Role,
    ) => {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const trimmedConfirm = confirmPassword.trim();

      const usernameError = validateUsername(trimmedUsername);
      if (usernameError) throw new Error(usernameError);

      const passwordError = validatePassword(trimmedPassword);
      if (passwordError) throw new Error(passwordError);

      if (trimmedPassword.length < 8)
        throw new Error('Password must be at least 8 characters.');

      if (trimmedPassword !== trimmedConfirm)
        throw new Error('Passwords do not match.');

      let users: User[] | null;
      try {
        users = await getItem<User[]>(STORAGE_KEYS.USERS);
      } catch {
        throw new Error('Something went wrong. Please try again.');
      }

      const existing = (users ?? []).find(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase(),
      );
      if (existing)
        throw new Error(
          'That username is already taken. Please choose another.',
        );

      const passwordHash = await hashPassword(trimmedPassword);

      const newUser: User = {
        id: generateId(),
        username: trimmedUsername,
        passwordHash,
        role,
        displayName: trimmedUsername,
        createdAt: new Date().toISOString(),
      };

      try {
        await setItem(STORAGE_KEYS.USERS, [...(users ?? []), newUser]);
        await setItem(STORAGE_KEYS.SESSION, newUser.id);
      } catch {
        throw new Error('Something went wrong. Please try again.');
      }

      setUser(newUser);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await removeItem(STORAGE_KEYS.SESSION);
    } catch {
      // best effort
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
