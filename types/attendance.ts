export interface Attendance {
  _id: string;
  sessionId: string;
  studentId: string;
  status: "present" | "late" | "absent" | "excused" | "left-early";
  checkInTime?: Date;
  checkOutTime?: Date;
  duration?: number; // minutes actually attended
  notes?: string;
  markedBy: string; // instructor ID
  markedAt: Date;
  updatedAt: Date;
  excuseReason?: string;
  excuseDocument?: string; // URL to uploaded document
}

export interface AttendanceRequest {
  sessionId: string;
  studentId: string;
  status: "present" | "late" | "absent" | "excused" | "left-early";
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  excuseReason?: string;
}

export interface BulkAttendanceRequest {
  sessionId: string;
  attendance: {
    studentId: string;
    status: "present" | "late" | "absent" | "excused" | "left-early";
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
  }[];
}

export interface AttendanceReport {
  _id: string;
  studentId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalSessions: number;
  attendedSessions: number;
  lateSessions: number;
  absentSessions: number;
  excusedSessions: number;
  attendanceRate: number; // percentage
  averageDuration: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentAttendance {
  _id: string;
  studentId: string;
  studentName: string;
  email: string;
  avatar?: string;
  totalSessions: number;
  attendedSessions: number;
  lateSessions: number;
  absentSessions: number;
  excusedSessions: number;
  attendanceRate: number;
  lastAttendance?: Date;
  streakDays?: number; // consecutive days attended
}

export interface SessionAttendance {
  _id: string;
  sessionId: string;
  sessionDate: Date;
  sessionTitle: string;
  instructorName: string;
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  attendanceRate: number;
  attendanceDetails: {
    studentId: string;
    studentName: string;
    status: "present" | "late" | "absent" | "excused";
    checkInTime?: Date;
    checkOutTime?: Date;
  }[];
}

export interface AttendanceAnalytics {
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalSessions: number;
  totalStudents: number;
  overallAttendanceRate: number;
  averageSessionAttendance: number;
  topPerformingStudents: StudentAttendance[];
  sessionsWithLowAttendance: SessionAttendance[];
  trends: {
    date: string;
    attendanceRate: number;
    sessionCount: number;
  }[];
}

export interface AttendanceNotification {
  _id: string;
  studentId: string;
  sessionId: string;
  type: "absence" | "late" | "streak" | "reminder";
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface AttendanceSettings {
  _id: string;
  organizationId: string;
  lateThreshold: number; // minutes after session start
  absenceThreshold: number; // minutes after session start
  autoMarkAbsent: boolean;
  allowExcuses: boolean;
  excuseDeadline: number; // hours after session
  notifications: {
    absenceAlert: boolean;
    lateAlert: boolean;
    streakNotification: boolean;
    reminderNotification: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
