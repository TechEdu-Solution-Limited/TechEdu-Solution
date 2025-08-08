"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiFetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      try {
        const res = await apiRequest("/api/teams/me/members", "GET");
        if (res.data) setMembers(res.data);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

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
