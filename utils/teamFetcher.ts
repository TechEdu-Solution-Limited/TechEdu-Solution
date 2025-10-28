"use client";

import { getApiRequest } from "@/lib/apiFetch";
import safeConsole from "@/lib/console";
import { getTokenFromCookies } from "@/lib/cookies";
import { TeamData, TeamMember } from "@/lib/team";
import { useState } from "react";

export const teamFetcher = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();

      // Get user data to extract team ID
      const userResponse = await getApiRequest(
        "/api/users/me",
        token || undefined
      );

      if (userResponse.status >= 400) {
        throw new Error("Failed to fetch user data");
      }

      const teamId = userResponse.data?.data?.data?.profile?._id;

      if (!teamId) {
        throw new Error("No team ID found in user profile");
      }

      // Fetch team data and members in parallel
      const [teamResponse, membersResponse] = await Promise.all([
        getApiRequest(`/api/teams/${teamId}`, token || undefined),
        getApiRequest(`/api/teams/${teamId}/members`, token || undefined),
      ]);
      console.log("Team response:", teamResponse);
      console.log("Members response:", membersResponse);

      if (teamResponse.status >= 400) {
        throw new Error("Failed to fetch team data");
      }

      if (membersResponse.status >= 400) {
        throw new Error("Failed to fetch team members");
      }

      setTeamData(teamResponse.data?.data);
      setMembers(membersResponse.data?.data?.members || []);
    } catch (error: any) {
      safeConsole.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };
  return { teamData, members, loading, fetchTeamData };
};
