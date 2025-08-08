// Product Types
export type {
  Product,
  ProductFilters,
  ProductSort,
  ProductSearchResult,
} from "./product";

// Payment Types
export type {
  PaymentIntent,
  Payment,
  PaymentWebhook,
  PaymentRefund,
  CreatePaymentIntentRequest,
  PaymentResponse,
  PaymentsResponse,
  PaymentFilters,
  UpdatePaymentRequest,
} from "./payment";

// Booking Types
export type {
  Booking,
  BookingRequest,
  BookingResponse,
  InstructorAvailability,
  Instructor,
  ServiceCategory,
  ServiceLevel,
} from "./booking";

// Session & Classroom Types
export type {
  Session,
  SessionRequest,
  SessionResponse,
  Classroom,
  ClassroomAvailability,
  ClassroomAssignment,
  VirtualSession,
  SessionMaterial,
} from "./session";

// Attendance Types
export type {
  Attendance,
  AttendanceRequest,
  BulkAttendanceRequest,
  AttendanceReport,
  StudentAttendance,
  SessionAttendance,
  AttendanceAnalytics,
  AttendanceNotification,
  AttendanceSettings,
} from "./attendance";

// Team Types
export type {
  Team,
  TeamLocation,
  TeamMember,
  TeamInvitation,
  LearningGoals,
  Attachments,
  CreateTeamRequest,
  UpdateTeamRequest,
  InviteTeamMemberRequest,
  AcceptInvitationRequest,
  DeclineInvitationRequest,
  TeamFilters,
  TeamSearchResult,
  UserTeamMembership,
  UserTeam,
  TeamAnalytics,
  TeamMemberDetail,
  TeamMemberPublicProfile,
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
} from "./team";

// Common Types
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    requestId: string;
    timestamp: string;
    durationMs: number;
    path: string;
  };
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}
