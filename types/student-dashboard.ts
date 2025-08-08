export interface StudentDashboardData {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatar: string;
    role: string;
  };

  profile: {
    completion: number;
    fields: {
      bio: boolean;
      education: boolean;
      uploads: boolean;
      contact: boolean;
      profilePicture: boolean;
      skills: boolean;
    };
  };

  courses: Course[];
  documents: Document[];
  services: Service[];
  learningGoals: LearningGoal[];
  supportTickets: SupportTicket[];
  announcements: Announcement[];
  notifications: Notification[];
}

export interface Course {
  id: number;
  name: string;
  progress: number;
  status: "Enrolled" | "Completed" | "Dropped";
  instructor: string;
  startDate: string;
  endDate: string;
  resumeLink: string;
  description?: string;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: number;
  name: string;
  completed: boolean;
}

export interface Document {
  id: number;
  name: string;
  status: "Approved" | "Pending" | "Rejected";
  uploadedAt: string;
  type: string;
  size?: string;
  description?: string;
  downloadUrl?: string;
  reviewNotes?: string;
}

export interface Service {
  id: number;
  name: string;
  status: "Active" | "Completed" | "Pending" | "Cancelled" | "Scheduled";
  type: string;
  bookedAt: string;
  link: string;
  description?: string;
  advisor?: string;
  scheduledDate?: string;
  duration?: string;
  price?: number;
  category?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
}

export interface LearningGoal {
  id: number;
  goal: string;
  progress: number;
  deadline: string;
  category?: string;
  description?: string;
  milestones?: GoalMilestone[];
  priority?: "High" | "Medium" | "Low";
  status?: "In Progress" | "Completed" | "Not Started";
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalMilestone {
  id: number;
  name: string;
  completed: boolean;
}

export interface SupportTicket {
  id: number;
  subject: string;
  status: "Open" | "Closed" | "In Progress";
  createdAt: string;
  lastUpdate: string;
  description?: string;
  priority?: "High" | "Medium" | "Low";
  category?: string;
  assignedTo?: string;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
  type?: "feature" | "update" | "course" | "reminder" | "event" | "maintenance";
  priority?: "high" | "medium" | "low";
  category?: string;
  read?: boolean;
  link?: string | null;
  image?: string | null;
}

export interface Notification {
  id: number;
  type: "offer" | "tip" | "reminder" | "alert" | "success" | "warning";
  message: string;
  date: string;
  read: boolean;
  link?: string;
  priority?: "high" | "medium" | "low";
}

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  activeCourses: number;
  totalDocuments: number;
  approvedDocuments: number;
  pendingDocuments: number;
  totalServices: number;
  activeServices: number;
  completedServices: number;
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  openTickets: number;
  unreadNotifications: number;
  unreadAnnouncements: number;
}
