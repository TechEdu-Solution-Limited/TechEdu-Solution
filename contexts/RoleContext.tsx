// contexts/RoleContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/lib/dashboardData";
import {
  getTokenFromCookies,
  saveTokenToCookies,
  deleteTokenFromCookies,
  clearAllCookies,
  saveTokensToCookies,
  saveUserDataToCookies,
} from "@/lib/cookies";
import {
  loginUser,
  logoutUser,
  getActiveRole,
  switchUserRole,
} from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import { isValidUserData } from "@/lib/utils";

import { logger } from "@/lib/logger";
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
      const cookies = document.cookie.split(";");
      const authToken = cookies.find((cookie) =>
        cookie.trim().startsWith("token=")
      );
      const userDataCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userData=")
      );

      if (authToken && userDataCookie) {
        try {
          const userDataValue = userDataCookie.split("=")[1];
          const userData = JSON.parse(decodeURIComponent(userDataValue));

          // Set user data from cookies
          setUserData(userData);
          setUserRole(userData.role || "student");
          setIsAuthenticated(true);
          setLoading(false);
          return true;
        } catch (error) {
          logger.error("Error parsing user data from cookies:", error);
        }
      }
      setLoading(false);
      return false;
    };

    // Check for authentication cookies
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
      logger.warn(
        `[Redirect] No route found for role: "${targetRole}". Defaulting to /dashboard/student`
      );
    }
  };

  const loginWithOAuth = (userData: any) => {
    const role = userData.role || "student";
    setUserRole(role);
    setUserData(userData);
    setIsAuthenticated(true);

    // Save to cookies
    const token = "oauth-token-" + Date.now();
    saveTokenToCookies(token);
    if (isValidUserData(userData)) {
      saveUserDataToCookies(userData);
    } else {
      logger.warn("Invalid user data, skipping cookie save.");
    }

    // Redirect to appropriate dashboard
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

      // Check if token is still valid
      const cookies = document.cookie.split(";");
      const userDataCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userData=")
      );

      if (userDataCookie) {
        try {
          const userDataValue = userDataCookie.split("=")[1];
          const userData = JSON.parse(decodeURIComponent(userDataValue));

          setUserData(userData);
          setUserRole(userData.role || "student");
          setIsAuthenticated(true);
          return true;
        } catch (error) {
          logger.error("Error parsing user data:", error);
        }
      }

      setIsAuthenticated(false);
      return false;
    } catch (error) {
      logger.error("Error refreshing auth:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout API endpoint using the apiFetch function
      const response = await logoutUser();

      if (response.status >= 400) {
        logger.error("Logout API call failed");
      }
    } catch (error) {
      logger.error("Error calling logout API:", error);
    } finally {
      // Clear local state regardless of API call result
      setUserRole("student");
      setUserData({ fullName: "", email: "", avatar: "", role: "student" });
      setIsAuthenticated(false);

      // Clear ALL cookies using the new comprehensive function
      clearAllCookies();

      // Redirect to home page
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
        logger.error("No token available for getActiveRole");
        return;
      }

      const response = await getActiveRole(token);

      if (response.data && response.data.data) {
        const activeRole = response.data.data.role;

        // Update local state if role has changed
        if (activeRole && activeRole !== userRole) {
          setUserRole(activeRole);
          setUserData((prev) => ({ ...prev, role: activeRole }));
        }
      }
    } catch (error) {
      logger.error("[RoleContext] Error getting active role:", error);
    }
  };

  // Switch user role between individual and team tech professional
  const switchUserRoleHandler = async () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        logger.error("No token available for switchUserRole");
        return;
      }

      const response = await switchUserRole(token);

      if (response.data && response.data.data) {
        const newRole = response.data.data.role;

        // Update local state
        setUserRole(newRole);
        setUserData((prev) => ({ ...prev, role: newRole }));

        // Update cookies
        const updatedUserData = { ...userData, role: newRole };
        saveUserDataToCookies(updatedUserData);

        // Redirect to appropriate dashboard
        redirectToRoleDashboard(newRole);
      }
    } catch (error) {
      logger.error("Error switching user role:", error);
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
