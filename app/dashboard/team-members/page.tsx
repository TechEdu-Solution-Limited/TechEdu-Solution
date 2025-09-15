"use client";

import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<string | null>(null);
  const { userData } = useRole();

  // First, get the user's teamId
  useEffect(() => {
    async function getTeamId() {
      const token = getTokenFromCookies();
      if (!token) {
        return;
      }

      try {
        // Get user's teams to find the teamId
        const res = await getApiRequest("/api/teams/my-teams", token);
        if (res.data && res.data.length > 0) {
          // Use the first team's ID
          const firstTeam = res.data[0];
          setTeamId(firstTeam.id || firstTeam._id);
          console.log("Found teamId:", firstTeam.id || firstTeam._id);
        }
      } catch (error) {
        console.error("Failed to get teamId:", error);
      }
    }
    getTeamId();
  }, []);

  // Then fetch members using the teamId
  useEffect(() => {
    async function fetchMembers() {
      if (!teamId) {
        return;
      }

      const token = getTokenFromCookies();
      if (!token) {
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching members for teamId:", teamId);
        const res = await getApiRequest(`/api/teams/${teamId}/members`, token);
        console.log("Members response:", res);
        if (res.data) setMembers(res.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [teamId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Members</h1>
      {loading ? (
        <div>Loading...</div>
      ) : members.length === 0 ? (
        <div>No team members found.</div>
      ) : (
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-[10px]"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.role}
                  </div>
                </div>
              </div>
              <Badge>{member.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
