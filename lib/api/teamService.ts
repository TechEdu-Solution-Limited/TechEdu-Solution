import {
  getApiRequest,
  postApiRequest,
  putApiRequest,
  deleteApiRequest,
  patchApiRequest,
} from "../apiFetch";
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  InviteTeamMemberRequest,
  AcceptInvitationRequest,
  DeclineInvitationRequest,
  TeamFilters,
  TeamSearchResult,
  TeamInvitation,
  UserTeam,
  TeamAnalytics,
  CreateTeamResponse,
  TeamsResponse,
  TeamInvitationsResponse,
  UserTeamsResponse,
  InviteMemberResponse,
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  TeamMembersResponse,
  TeamMembersPublicProfilesResponse,
  LeaveTeamResponse,
  ApiResponse,
} from "@/types";

export class TeamService {
  private static baseUrl = "/api/teams";

  /**
   * Create a new team
   */
  static async createTeam(
    teamData: CreateTeamRequest,
    token: string
  ): Promise<ApiResponse<CreateTeamResponse>> {
    return postApiRequest(this.baseUrl, teamData, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get all teams with filtering and pagination
   */
  static async getTeams(
    filters?: TeamFilters,
    token?: string
  ): Promise<ApiResponse<TeamsResponse>> {
    const params = filters ? new URLSearchParams() : undefined;

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params!.append(key, value.toString());
        }
      });
    }

    const url = params ? `${this.baseUrl}?${params.toString()}` : this.baseUrl;
    return getApiRequest(url, token);
  }

  /**
   * Get a single team by ID
   */
  static async getTeam(
    teamId: string,
    token?: string
  ): Promise<ApiResponse<Team>> {
    return getApiRequest(`${this.baseUrl}/${teamId}`, token);
  }

  /**
   * Update team information (team lead only)
   */
  static async updateTeam(
    teamId: string,
    updateData: Partial<CreateTeamRequest>,
    token: string
  ): Promise<ApiResponse<Team>> {
    return patchApiRequest(`${this.baseUrl}/${teamId}`, token, updateData);
  }

  /**
   * Delete team (team lead only)
   */
  static async deleteTeam(
    teamId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return deleteApiRequest(`${this.baseUrl}/${teamId}`, token);
  }

  /**
   * Invite a member to the team
   */
  static async inviteMember(
    teamId: string,
    invitationData: InviteTeamMemberRequest,
    token: string
  ): Promise<ApiResponse<InviteMemberResponse>> {
    return postApiRequest(`${this.baseUrl}/${teamId}/invite`, invitationData, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Accept team invitation using invitation token
   */
  static async acceptInvitation(
    invitationData: AcceptInvitationRequest,
    token: string
  ): Promise<ApiResponse<AcceptInvitationResponse>> {
    return postApiRequest(`${this.baseUrl}/invite/accept`, invitationData, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Decline team invitation using invitation token
   */
  static async declineInvitation(
    invitationData: DeclineInvitationRequest,
    token: string
  ): Promise<ApiResponse<DeclineInvitationResponse>> {
    return postApiRequest(`${this.baseUrl}/invite/decline`, invitationData, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Revoke team invitation (team lead only)
   */
  static async revokeInvitation(
    teamId: string,
    memberId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return deleteApiRequest(
      `${this.baseUrl}/${teamId}/invite/${memberId}`,
      token
    );
  }

  /**
   * Get team members (team lead only)
   */
  static async getTeamMembers(
    teamId: string,
    token: string
  ): Promise<ApiResponse<TeamMembersResponse>> {
    return getApiRequest(`${this.baseUrl}/${teamId}/members`, token);
  }

  /**
   * Get team members public profiles (team members only)
   */
  static async getTeamMembersPublicProfiles(
    teamId: string,
    token: string
  ): Promise<ApiResponse<TeamMembersPublicProfilesResponse>> {
    return getApiRequest(
      `${this.baseUrl}/${teamId}/members/public-profiles`,
      token
    );
  }

  /**
   * Leave team (member only)
   */
  static async leaveTeam(
    teamId: string,
    token: string
  ): Promise<ApiResponse<LeaveTeamResponse>> {
    return postApiRequest(
      `${this.baseUrl}/${teamId}/leave`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Get user's team memberships
   */
  static async getUserTeams(
    token: string
  ): Promise<ApiResponse<UserTeamsResponse>> {
    return getApiRequest(`${this.baseUrl}/my-teams`, token);
  }

  /**
   * Get user's pending invitations
   */
  static async getUserInvitations(
    token: string
  ): Promise<ApiResponse<TeamInvitationsResponse>> {
    return getApiRequest(`${this.baseUrl}/invitations`, token);
  }

  /**
   * Search teams
   */
  static async searchTeams(
    query: string,
    filters?: TeamFilters,
    token?: string
  ): Promise<ApiResponse<TeamsResponse>> {
    const params = new URLSearchParams();
    params.append("search", query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return getApiRequest(`${this.baseUrl}/search?${params.toString()}`, token);
  }

  /**
   * Get team analytics
   */
  static async getTeamAnalytics(
    token: string
  ): Promise<ApiResponse<TeamAnalytics>> {
    return getApiRequest(`${this.baseUrl}/analytics`, token);
  }

  /**
   * Get popular teams
   */
  static async getPopularTeams(
    limit: number = 6,
    token?: string
  ): Promise<ApiResponse<{ teams: Team[] }>> {
    return getApiRequest(`${this.baseUrl}/popular`, token, { limit });
  }

  /**
   * Get featured teams
   */
  static async getFeaturedTeams(
    limit: number = 6,
    token?: string
  ): Promise<ApiResponse<{ teams: Team[] }>> {
    return getApiRequest(`${this.baseUrl}/featured`, token, { limit });
  }

  /**
   * Get teams by specialization
   */
  static async getTeamsBySpecialization(
    specialization: string,
    token?: string
  ): Promise<ApiResponse<{ teams: Team[] }>> {
    return getApiRequest(
      `${this.baseUrl}/specialization/${specialization}`,
      token
    );
  }

  /**
   * Get teams by location
   */
  static async getTeamsByLocation(
    country: string,
    state?: string,
    city?: string,
    token?: string
  ): Promise<ApiResponse<{ teams: Team[] }>> {
    const params = new URLSearchParams();
    params.append("country", country);
    if (state) params.append("state", state);
    if (city) params.append("city", city);

    return getApiRequest(
      `${this.baseUrl}/location?${params.toString()}`,
      token
    );
  }

  /**
   * Cancel invitation (team lead only)
   */
  static async cancelInvitation(
    invitationId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return deleteApiRequest(
      `${this.baseUrl}/invitations/${invitationId}`,
      token
    );
  }

  /**
   * Resend invitation (team lead only)
   */
  static async resendInvitation(
    invitationId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/invitations/${invitationId}/resend`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Update member role (team lead only)
   */
  static async updateMemberRole(
    teamId: string,
    memberId: string,
    role: "teamLead" | "member",
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return putApiRequest(
      `${this.baseUrl}/${teamId}/members/${memberId}/role`,
      { role },
      token
    );
  }

  /**
   * Transfer team leadership (team lead only)
   */
  static async transferLeadership(
    teamId: string,
    newLeaderId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/${teamId}/transfer-leadership`,
      { newLeaderId },
      { Authorization: `Bearer ${token}` }
    );
  }
}
