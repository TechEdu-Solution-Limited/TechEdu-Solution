"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserMe } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";
import { UserProfile, ProfileContextType } from "@/types/profile";

import { logger } from "@/lib/logger";
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getCookie("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await getUserMe(token);

      if (response && response.data && response.data.success) {
        setProfile(response.data.data.data);
      } else {
        throw new Error(response?.data?.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      logger.error("Error fetching profile:", err);
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      // Here you would typically make an API call to update the profile
      // For now, we'll just update the local state
      if (profile) {
        setProfile({ ...profile, ...data });
      }
    } catch (err: any) {
      logger.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const setProfileData = (newProfile: UserProfile | null) => {
    setProfile(newProfile);
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
  };

  // Auto-fetch profile when component mounts if there's a token
  useEffect(() => {
    const token = getCookie("token");
    if (token && !profile) {
      fetchProfile();
    }
  }, [profile]);

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    setProfile: setProfileData,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
