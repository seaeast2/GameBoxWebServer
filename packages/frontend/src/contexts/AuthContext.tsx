import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  authService,
  AuthResponse,
  UserProfile,
} from "../services/authService";

interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      const profile = res.data;
      const u: AuthUser = {
        id: profile.ID,
        email: profile.EMAIL,
        nickname: profile.NICKNAME,
        role: profile.ROLE,
      };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const { user: u, access_token } = res.data;
    localStorage.setItem("access_token", access_token);
    const authUser: AuthUser = {
      id: u.id,
      email: u.email,
      nickname: u.nickname,
      role: u.role,
    };
    localStorage.setItem("user", JSON.stringify(authUser));
    setUser(authUser);
  };

  const signup = async (email: string, password: string, nickname: string) => {
    const res = await authService.signup({ email, password, nickname });
    const { user: u, access_token } = res.data;
    localStorage.setItem("access_token", access_token);
    const authUser: AuthUser = {
      id: u.id,
      email: u.email,
      nickname: u.nickname,
      role: u.role,
    };
    localStorage.setItem("user", JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
