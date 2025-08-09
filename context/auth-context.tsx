"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { UserType } from "@/lib/types";

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

interface AuthContextType {
  user: UserType | null;
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
  setCookie("accessToken", accessToken, {
    path: "/",
    maxAge: 60 * 15,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

const clearAccessTokenCookie = () => {
  deleteCookie("accessToken", { path: "/" });
};

const clearRefreshTokenCookie = () => {
  deleteCookie("refreshToken", { path: "/" });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
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
        const response = await axiosInstance.get("/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Failed to validate session:", error);
        clearAccessTokenCookie();
        setUser(null);
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

      const response = await axiosInstance.get("/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.data.role !== Role.ADMIN) {
        toast.error("Wrong username or password");
        clearAccessTokenCookie();
        return;
      }

      setUser(response.data.data);
    } catch (error) {
      console.error("Login failed:", error);
      clearAccessTokenCookie();
      clearRefreshTokenCookie();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.delete("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAccessTokenCookie();
      clearRefreshTokenCookie();
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
