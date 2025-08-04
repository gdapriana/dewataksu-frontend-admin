"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

type ImageType = {
  id: string;
  url: string | null;
  publicId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  password?: string | null;
  bio: string | null;
  refreshToken?: string | null;
  role: Role;
  profileImageId: string | null;
  profileImage: ImageType | null;
  createdAt: Date;
  updatedAt: Date;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

const setAccessTokenCookie = (accessToken: string) => {
  setCookie("accessToken", accessToken, { path: "/" });
};

const clearAccessTokenCookie = () => {
  deleteCookie("accessToken", { path: "/" });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateUserSession = async () => {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Gagal memvalidasi sesi:", error);
        setUser(null);
        clearAccessTokenCookie();
      } finally {
        setIsLoading(false);
      }
    };
    validateUserSession();
  }, []);

  const login = async (accessToken: string) => {
    setIsLoading(true);
    try {
      setAccessTokenCookie(accessToken);
      const response = await axiosInstance.get("/me");
      if (response.data.data.role !== "ADMIN") {
        toast.error("wrong username or password");
        return;
      }
      setUser(response.data.data);
    } catch (error) {
      console.error("login failed:", error);
      clearAccessTokenCookie();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("something wrong", error);
    } finally {
      clearAccessTokenCookie();
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const isAuthenticated = !!user;
  const value = { user, isAuthenticated, isLoading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
