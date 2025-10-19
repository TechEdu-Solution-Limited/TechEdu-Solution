"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/lib/dashboardData";
import {
  getTokenFromCookies,
  saveTokenToCookies,
  clearAllCookies,
  saveUserDataToCookies,
  getUserDataFromCookies,
} from "@/lib/cookies";
import { logoutUser, getActiveRole, switchUserRole } from "@/lib/apiFetch";
import { isValidUserData } from "@/lib/utils";
import { safeConsole } from "@/lib/console";

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userData: {
    fullName: string;
    email: string;
    avatar?: string;
    role?: UserRole;
  };
  setUserData: (data: any) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginWithOAuth: (userData: any) => void;
  logout: () => void;
  redirectToRoleDashboard: (role?: UserRole) => void;
  loading: boolean;
  refreshAuth: () => Promise<boolean>;
  getActiveRole: () => Promise<void>;
  switchUserRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    avatar: "",
    role: "student" as UserRole,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from cookies on mount
  useEffect(() => {
    const checkAuthCookies = () => {
      const token = getTokenFromCookies();
      const parsed = getUserDataFromCookies<typeof userData>();

      if (token && parsed) {
        setUserData(parsed);
        setUserRole((parsed.role as UserRole) || "student");
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    };

    checkAuthCookies();
  }, []);

  const dashboardRoutes: Record<UserRole, string> = {
    student: "/dashboard/student",
    individualTechProfessional: "/dashboard/individual-tech-professional",
    teamTechProfessional: "/dashboard/team-tech-professional",
    recruiter: "/dashboard/company",
    institution: "/dashboard/institution",
    // admin: "/dashboard/admin",
  };

  const redirectToRoleDashboard = (role?: UserRole) => {
    const targetRole = role || userRole;
    const targetRoute = dashboardRoutes[targetRole] || "/dashboard/student";
    window.location.href = targetRoute;

    if (!dashboardRoutes[targetRole]) {
      safeConsole.warn(
        `[Redirect] No route found for role: "${targetRole}". Defaulting to /dashboard/student`
      );
    }
  };

  const loginWithOAuth = (incoming: any) => {
    const role = incoming.role || "student";
    setUserRole(role);
    setUserData(incoming);
    setIsAuthenticated(true);

    // Save to cookies
    const token = "oauth-token-" + Date.now();
    saveTokenToCookies(token);
    if (isValidUserData(incoming)) {
      saveUserDataToCookies(incoming); // encodes + JSON.stringify
    } else {
      safeConsole.warn("Invalid user data, skipping cookie save.");
    }

    redirectToRoleDashboard(role);
  };

  // Refresh authentication state
  const refreshAuth = async (): Promise<boolean> => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }

      const parsed = getUserDataFromCookies<typeof userData>();
      if (parsed) {
        setUserData(parsed);
        setUserRole((parsed.role as UserRole) || "student");
        setIsAuthenticated(true);
        return true;
      }

      setIsAuthenticated(false);
      return false;
    } catch (error) {
      safeConsole.error("Error refreshing auth:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      if (response.status >= 400) {
        safeConsole.error("Logout API call failed");
      }
    } catch (error) {
      safeConsole.error("Error calling logout API:", error);
    } finally {
      setUserRole("student");
      setUserData({ fullName: "", email: "", avatar: "", role: "student" });
      setIsAuthenticated(false);

      clearAllCookies();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  // Get user's current active role
  const getActiveRoleHandler = async () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        safeConsole.error("No token available for getActiveRole");
        return;
      }

      const response = await getActiveRole(token);
      const activeRole = response?.data?.data?.role as UserRole | undefined;

      if (activeRole && activeRole !== userRole) {
        setUserRole(activeRole);
        setUserData((prev) => ({ ...prev, role: activeRole }));
      }
    } catch (error) {
      safeConsole.error("[RoleContext] Error getting active role:", error);
    }
  };

  // Switch user role between individual and team tech professional
  const switchUserRoleHandler = async () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        safeConsole.error("No token available for switchUserRole");
        return;
      }

      const response = await switchUserRole(token);
      const newRole = response?.data?.data?.role as UserRole | undefined;

      if (newRole) {
        setUserRole(newRole);
        setUserData((prev) => {
          const updated = { ...prev, role: newRole };
          // Persist updated role to cookie (encoded JSON)
          saveUserDataToCookies(updated);
          return updated;
        });

        redirectToRoleDashboard(newRole);
      }
    } catch (error) {
      safeConsole.error("Error switching user role:", error);
    }
  };

  const value = {
    userRole,
    setUserRole,
    userData,
    setUserData,
    isAuthenticated,
    setIsAuthenticated,
    loginWithOAuth,
    logout,
    redirectToRoleDashboard,
    loading,
    refreshAuth,
    getActiveRole: getActiveRoleHandler,
    switchUserRole: switchUserRoleHandler,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
