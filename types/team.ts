// Team Management Types

export interface TeamLocation {
  country: string;
  state: string;
  city: string;
}

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: "teamLead" | "member";
  joinedAt: string;
  status: "active" | "pending" | "inactive";
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  invitedBy: {
    id: string;
    fullName: string;
    email: string;
  };
  invitedUser: {
    id: string;
    fullName: string;
    email: string;
  };
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: string;
  expiresAt: string;
}

export interface LearningGoals {
  goalType: "specific_training" | "skill_development" | "career_growth";
  priorityAreas: string[];
  trainingTimeline: string;
}

export interface Attachments {
  companyIntroUrl?: string;
  skillMatrixUrl?: string;
  projectSamplesUrl?: string;
  ndaOrAgreementUrl?: string;
}

export interface Team {
  id: string;
  teamName: string;
  teamSize: number;
  currentMembers: number;
  location: TeamLocation;
  primarySpecialization: string;
  programmingLanguages: string[];
  frameworksAndTools: string[];
  softSkills: string[];
  preferredTechStack: string[];
  experienceLevel: "Junior" | "Mid-Level" | "Senior" | "Lead" | "Principal";
  currentJobTitle: string;
  yearsOfExperience: number;
  industryFocus: string;
  employmentStatus: "employed" | "unemployed" | "freelancer" | "student";
  remoteWorkExperience: boolean;
  trainingAvailability: "full-time" | "part-time" | "weekends" | "evenings";
  contactEmail: string;
  contactPhone: string;
  resumeUrl?: string;
  learningGoals?: LearningGoals;
  attachments?: Attachments;
  platformGoals?: string[];
  jobTypePreference?: "full-time" | "part-time" | "contract" | "freelance";
  salaryExpectation?: string;
  availabilityType?: "immediate" | "2_weeks" | "1_month" | "3_months";
  workingHoursPreference?: string;
  lookingForJobs: boolean;
  interestedInTraining: boolean;
  skillAssessmentInterested?: boolean;
  availableAsInstructor?: boolean;
  preferredOpportunityStart?: string;
  additionalProjectLinks?: string[];
  teamLead: TeamMember;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateTeamRequest {
  teamName: string;
  teamSize: number;
  location: TeamLocation;
  primarySpecialization: string;
  programmingLanguages: string[];
  frameworksAndTools: string[];
  softSkills: string[];
  preferredTechStack: string[];
  experienceLevel: "Junior" | "Mid-Level" | "Senior" | "Lead" | "Principal";
  currentJobTitle: string;
  yearsOfExperience: number;
  industryFocus: string;
  employmentStatus: "employed" | "unemployed" | "freelancer" | "student";
  remoteWorkExperience: boolean;
  trainingAvailability: "full-time" | "part-time" | "weekends" | "evenings";
  contactEmail: string;
  contactPhone: string;
  resumeUrl?: string;
  learningGoals?: LearningGoals;
  attachments?: Attachments;
  platformGoals?: string[];
  jobTypePreference?: "full-time" | "part-time" | "contract" | "freelance";
  salaryExpectation?: string;
  availabilityType?: "immediate" | "2_weeks" | "1_month" | "3_months";
  workingHoursPreference?: string;
  lookingForJobs: boolean;
  interestedInTraining: boolean;
  skillAssessmentInterested?: boolean;
  availableAsInstructor?: boolean;
  preferredOpportunityStart?: string;
  additionalProjectLinks?: string[];
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {
  teamId: string;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: string;
}

export interface AcceptInvitationRequest {
  invitationToken: string;
}

export interface DeclineInvitationRequest {
  invitationToken: string;
}

export interface TeamFilters {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  experienceLevel?: string;
  location?: string;
  employmentStatus?: string;
  lookingForJobs?: boolean;
  interestedInTraining?: boolean;
}

export interface TeamSearchResult {
  teams: Team[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: TeamFilters;
}

export interface UserTeamMembership {
  teamId: string;
  teamName: string;
  role: "teamLead" | "member";
  joinedAt: string;
  status: "active" | "pending" | "inactive";
}

export interface TeamAnalytics {
  totalTeams: number;
  totalMembers: number;
  activeTeams: number;
  pendingInvitations: number;
  teamsCreated: number;
  teamsJoined: number;
}

export interface TeamMemberDetail {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "accepted" | "pending" | "declined";
  invitedAt: string;
  joinedAt?: string;
  invitedBy: {
    id: string;
    fullName: string;
  };
}

export interface TeamMemberPublicProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  primarySpecialization: string;
  experienceLevel: string;
  yearsOfExperience: number;
  programmingLanguages: string[];
  frameworksAndTools: string[];
  preferredTechStack: string[];
  currentJobTitle: string;
  industryFocus: string;
  employmentStatus: string;
  remoteWorkExperience: boolean;
  lookingForJobs: boolean;
  interestedInTraining: boolean;
  joinedAt: string;
}

export interface UserTeam {
  id: string;
  teamName: string;
  role: "team_lead" | "member";
  teamSize: number;
  primarySpecialization: string;
  experienceLevel: string;
  preferredTechStack: string[];
  lookingForJobs: boolean;
  interestedInTraining: boolean;
  joinedAt: string;
}

// API Response Types
export interface CreateTeamResponse {
  success: boolean;
  message: string;
  data: {
    team: Team;
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface TeamsResponse {
  success: boolean;
  data: TeamSearchResult;
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface TeamInvitationsResponse {
  success: boolean;
  data: {
    invitations: TeamInvitation[];
    totalCount: number;
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface UserTeamsResponse {
  success: boolean;
  data: {
    teams: UserTeam[];
    totalTeams: number;
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface InviteMemberResponse {
  success: boolean;
  message: string;
  data: {
    invitedMember: {
      email: string;
      fullName: string;
      role: string;
    };
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  data: {
    team: {
      id: string;
      name: string;
    };
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface DeclineInvitationResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface TeamMembersResponse {
  success: boolean;
  message: string;
  data: {
    teamId: string;
    teamName: string;
    members: TeamMemberDetail[];
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface TeamMembersPublicProfilesResponse {
  success: boolean;
  message: string;
  data: {
    teamId: string;
    teamName: string;
    members: TeamMemberPublicProfile[];
    totalMembers: number;
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface LeaveTeamResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    team: {
      id: string;
      name: string;
    };
  };
  meta: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}
