"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Mail,
  UserPlus,
  Settings,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "react-toastify";
import {
  deleteApiRequest,
  getApiRequest,
  postApiRequest,
} from "@/lib/apiFetch";

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "invited";
  avatar?: string;
  joinedAt?: string;
  lastActive?: string;
}

interface TeamInfo {
  teamId: string;
  teamName: string;
  teamSize: number;
  companyId: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  primarySpecialization: string;
  contactEmail: string;
  contactPhone: string;
  experienceLevel: string;
  yearsOfExperience: number;
  isActive: boolean;
  onboardingStatus: string;
}

interface InviteMemberData {
  email: string;
  role: string;
}

export default function TeamManagementPage() {
  const router = useRouter();
  const { userData, userRole } = useRole();
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [inviteData, setInviteData] = useState<InviteMemberData>({
    email: "",
    role: "",
  });

  // Fetch team data on mount
  useEffect(() => {
    async function fetchTeamData() {
      setLoading(true);
      try {
        const [teamInfoRes, membersRes] = await Promise.all([
          getApiRequest("/api/teams/me"),
          getApiRequest("/api/teams/me/members"),
        ]);
        if (teamInfoRes.data) {
          setTeamInfo(teamInfoRes.data);
        }
        if (membersRes.data) {
          setTeamMembers(membersRes.data || []);
        }
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchTeamData();
  }, [userData.email]);

  // Guard: If not authenticated or not teamTechProfessional, show not authorized
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading team data...</span>
        </div>
      </div>
    );
  }
  if (userRole !== "teamTechProfessional") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Not Authorized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You do not have permission to access this page.
            </p>
            <Button
              onClick={() => router.push("/dashboard/team-tech-professional")}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInviteMember = async () => {
    if (!inviteData.email || !inviteData.role) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await postApiRequest(
        `/api/teams/${teamInfo?.teamId}/invite`,
        inviteData
      );

      if (response.data) {
        toast.success("Invitation sent successfully!");
        setInviteModalOpen(false);
        setInviteData({ email: "", role: "" });
        // Refresh members list
        // Re-run the effect by calling fetchTeamDataAndCheckAdmin
        // (or just refetch members)
        // For simplicity, just reload the page:
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleRevokeInvitation = async (memberId: string) => {
    if (!confirm("Are you sure you want to revoke this invitation?")) return;

    try {
      const response = await deleteApiRequest(
        `/api/teams/${teamInfo?.teamId}/invite/${memberId}`,
        "DELETE"
      );

      if (response.data) {
        toast.success("Invitation revoked successfully!");
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to revoke invitation");
      }
    } catch (error) {
      console.error("Error revoking invitation:", error);
      toast.error("Failed to revoke invitation");
    }
  };

  const handleUpdateTeamInfo = async (updatedData: Partial<TeamInfo>) => {
    try {
      const response = await postApiRequest(
        `/api/teams/${teamInfo?.teamId}`,
        updatedData
      );

      if (response.data) {
        toast.success("Team information updated successfully!");
        setSettingsModalOpen(false);
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to update team information");
      }
    } catch (error) {
      console.error("Error updating team info:", error);
      toast.error("Failed to update team information");
    }
  };

  // Filter members based on search and status
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading team data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Team Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white rounded-[10px]">
              <DialogHeader>
                <DialogTitle>Team Settings</DialogTitle>
                <DialogDescription>
                  Update your team information and preferences
                </DialogDescription>
              </DialogHeader>
              <TeamSettingsForm
                teamInfo={teamInfo}
                onUpdate={handleUpdateTeamInfo}
                onClose={() => setSettingsModalOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-white hover:text-black">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className=" bg-white rounded-[10px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team
                </DialogDescription>
              </DialogHeader>
              <InviteMemberForm
                inviteData={inviteData}
                setInviteData={setInviteData}
                onSubmit={handleInviteMember}
                onClose={() => setInviteModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Overview */}
      {teamInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {teamInfo.teamSize}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Members
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {teamMembers.filter((m) => m.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Members
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {teamMembers.filter((m) => m.status === "invited").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Invitations
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members and invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-[10px]"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 rounded-[10px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px]">
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Pending</SelectItem>
                <SelectItem value="pending">Awaiting Response</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No members found</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onRevokeInvitation={handleRevokeInvitation}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Team Member Card Component
function TeamMemberCard({
  member,
  onRevokeInvitation,
}: {
  member: TeamMember;
  onRevokeInvitation: (memberId: string) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "invited":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Invited
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-[10px]">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={member.avatar} />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{member.name}</div>
          <div className="text-sm text-muted-foreground">{member.email}</div>
          <div className="text-sm text-muted-foreground">{member.role}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {getStatusBadge(member.status)}
        {member.status === "invited" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRevokeInvitation(member.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Invite Member Form Component
function InviteMemberForm({
  inviteData,
  setInviteData,
  onSubmit,
  onClose,
}: {
  inviteData: InviteMemberData;
  setInviteData: (data: InviteMemberData) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <form onClick={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={inviteData.email}
          onChange={(e) =>
            setInviteData({ ...inviteData, email: e.target.value })
          }
          className="rounded-[10px]"
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          placeholder="Senior Developer"
          value={inviteData.role}
          onChange={(e) =>
            setInviteData({ ...inviteData, role: e.target.value })
          }
          className="rounded-[10px]"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} className="rounded-[10px]">
          Cancel
        </Button>
        <Button
          type="button"
          className="text-white hover:text-black rounded-[10px]"
        >
          Send Invitation
        </Button>
      </div>
    </form>
  );
}

// Team Settings Form Component
function TeamSettingsForm({
  teamInfo,
  onUpdate,
  onClose,
}: {
  teamInfo: TeamInfo | null;
  onUpdate: (data: Partial<TeamInfo>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    teamName: teamInfo?.teamName || "",
    contactEmail: teamInfo?.contactEmail || "",
    contactPhone: teamInfo?.contactPhone || "",
    primarySpecialization: teamInfo?.primarySpecialization || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="teamName">Team Name</Label>
        <Input
          id="teamName"
          value={formData.teamName}
          onChange={(e) =>
            setFormData({ ...formData, teamName: e.target.value })
          }
          className="rounded-[10px]"
        />
      </div>
      <div>
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) =>
            setFormData({ ...formData, contactEmail: e.target.value })
          }
          className="rounded-[10px]"
        />
      </div>
      <div>
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Input
          id="contactPhone"
          value={formData.contactPhone}
          onChange={(e) =>
            setFormData({ ...formData, contactPhone: e.target.value })
          }
          className="rounded-[10px]"
        />
      </div>
      <div>
        <Label htmlFor="primarySpecialization">Primary Specialization</Label>
        <Input
          id="primarySpecialization"
          value={formData.primarySpecialization}
          onChange={(e) =>
            setFormData({ ...formData, primarySpecialization: e.target.value })
          }
          className="rounded-[10px]"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Update Team</Button>
      </div>
    </form>
  );
}
