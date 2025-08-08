import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  BookOpen,
  Award,
  MessageSquare,
  Calendar,
  BarChart3,
  Target,
  Heart,
  Globe,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  Home,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  CreditCard,
} from "lucide-react";

export type UserRole =
  | "student"
  | "institution"
  | "individualTechProfessional"
  | "teamTechProfessional"
  | "recruiter"
  | "admin";

export interface DashboardMenuItem {
  id: string;
  title: string;
  href: string;
  icon: any;
  badge?: string | number;
  isActive?: boolean;
  children?: DashboardMenuItem[];
}

export interface DashboardSection {
  id: string;
  title: string;
  items: DashboardMenuItem[];
}

export interface RoleDashboardData {
  role: UserRole;
  displayName: string;
  description: string;
  sections: DashboardSection[];
  quickActions: DashboardMenuItem[];
  stats: {
    label: string;
    value: string | number;
    change?: string;
    icon: any;
  }[];
}

export const dashboardData: Record<UserRole, RoleDashboardData> = {
  student: {
    role: "student",
    displayName: "Student Dashboard",
    description: "Academic support, scholarship guidance, and mentorship",
    sections: [
      {
        id: "overview",
        title: "Overview",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            href: "/dashboard/student",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            id: "profile",
            title: "My Profile",
            href: "/dashboard/profile",
            icon: User,
          },
          {
            id: "notifications",
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
            badge: 3,
          },
        ],
      },
      {
        id: "academic",
        title: "Academic",
        items: [
          {
            id: "scholarships",
            title: "Scholarship Coach",
            href: "/tools/scholarship-coach",
            icon: Award,
          },
          {
            id: "mentorship",
            title: "Mentorship",
            href: "/dashboard/mentorship",
            icon: Users,
          },
          {
            id: "courses",
            title: "My Courses",
            href: "/dashboard/courses",
            icon: BookOpen,
          },
          {
            id: "assignments",
            title: "Assignments",
            href: "/dashboard/assignments",
            icon: FileText,
          },
        ],
      },
      {
        id: "career",
        title: "Career Prep",
        items: [
          {
            id: "cv-builder",
            title: "CV Builder",
            href: "/tools/cv-builder",
            icon: FileText,
          },
          {
            id: "career-connect",
            title: "CareerConnect",
            href: "/career-connect/graduates",
            icon: Globe,
          },
          {
            id: "training",
            title: "Training Programs",
            href: "/training/individual",
            icon: GraduationCap,
          },
        ],
      },
      {
        id: "settings",
        title: "Settings",
        items: [
          {
            id: "account",
            title: "Account Settings",
            href: "/dashboard/settings",
            icon: Settings,
          },
          {
            id: "preferences",
            title: "Preferences",
            href: "/dashboard/preferences",
            icon: User,
          },
        ],
      },
    ],
    quickActions: [
      {
        id: "build-cv",
        title: "Build CV",
        href: "/tools/cv-builder",
        icon: Plus,
      },
      {
        id: "find-scholarship",
        title: "Find Scholarship",
        href: "/tools/scholarship-coach",
        icon: Search,
      },
      {
        id: "join-training",
        title: "Join Training",
        href: "/training/individual",
        icon: BookOpen,
      },
    ],
    stats: [
      {
        label: "Active Courses",
        value: 3,
        change: "+1",
        icon: BookOpen,
      },
      {
        label: "Scholarships Applied",
        value: 8,
        change: "+2",
        icon: Award,
      },
      {
        label: "Mentorship Sessions",
        value: 12,
        change: "+3",
        icon: Users,
      },
      {
        label: "CV Views",
        value: 24,
        change: "+5",
        icon: Eye,
      },
    ],
  },

  institution: {
    role: "institution",
    displayName: "Graduate Dashboard",
    description: "Job search tools, CV building, and career coaching",
    sections: [
      {
        id: "overview",
        title: "Overview",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            id: "profile",
            title: "My Profile",
            href: "/dashboard/profile",
            icon: User,
          },
          {
            id: "notifications",
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
            badge: 5,
          },
        ],
      },
      {
        id: "job-search",
        title: "Job Search",
        items: [
          {
            id: "career-connect",
            title: "CareerConnect",
            href: "/career-connect/graduates",
            icon: Globe,
          },
          {
            id: "job-applications",
            title: "My Applications",
            href: "/dashboard/applications",
            icon: FileText,
          },
          {
            id: "saved-jobs",
            title: "Saved Jobs",
            href: "/dashboard/saved-jobs",
            icon: Heart,
          },
          {
            id: "job-alerts",
            title: "Job Alerts",
            href: "/dashboard/job-alerts",
            icon: Bell,
          },
        ],
      },
      {
        id: "career-tools",
        title: "Career Tools",
        items: [
          {
            id: "cv-builder",
            title: "CV Builder",
            href: "/tools/cv-builder",
            icon: FileText,
          },
          {
            id: "coaching",
            title: "Career Coaching",
            href: "/dashboard/coaching",
            icon: Users,
          },
          {
            id: "training",
            title: "Skill Training",
            href: "/training/individual",
            icon: GraduationCap,
          },
          {
            id: "certifications",
            title: "Certifications",
            href: "/training/certifications",
            icon: Award,
          },
        ],
      },
      {
        id: "settings",
        title: "Settings",
        items: [
          {
            id: "account",
            title: "Account Settings",
            href: "/dashboard/settings",
            icon: Settings,
          },
          {
            id: "privacy",
            title: "Privacy",
            href: "/dashboard/privacy",
            icon: Shield,
          },
        ],
      },
    ],
    quickActions: [
      {
        id: "update-cv",
        title: "Update CV",
        href: "/tools/cv-builder",
        icon: Edit,
      },
      {
        id: "apply-jobs",
        title: "Apply to Jobs",
        href: "/career-connect/graduates",
        icon: Plus,
      },
      {
        id: "book-coaching",
        title: "Book Coaching",
        href: "/dashboard/coaching",
        icon: Calendar,
      },
    ],
    stats: [
      {
        label: "Applications",
        value: 15,
        change: "+3",
        icon: FileText,
      },
      {
        label: "Profile Views",
        value: 42,
        change: "+8",
        icon: Eye,
      },
      {
        label: "Interviews",
        value: 6,
        change: "+2",
        icon: Calendar,
      },
      {
        label: "Certifications",
        value: 4,
        change: "+1",
        icon: Award,
      },
    ],
  },

  individualTechProfessional: {
    role: "individualTechProfessional",
    displayName: "Professional Dashboard",
    description: "Upskill, certifications, and career advancement",
    sections: [
      {
        id: "overview",
        title: "Overview",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            id: "profile",
            title: "My Profile",
            href: "/dashboard/profile",
            icon: User,
          },
          {
            id: "notifications",
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
            badge: 2,
          },
        ],
      },
      {
        id: "learning",
        title: "Learning",
        items: [
          {
            id: "courses",
            title: "My Courses",
            href: "/dashboard/courses",
            icon: BookOpen,
          },
          {
            id: "certifications",
            title: "Certifications",
            href: "/training/certifications",
            icon: Award,
          },
          {
            id: "mentorship",
            title: "Mentorship",
            href: "/dashboard/mentorship",
            icon: Users,
          },
          {
            id: "skills",
            title: "Skills Assessment",
            href: "/dashboard/skills",
            icon: Target,
          },
        ],
      },
      {
        id: "career",
        title: "Career",
        items: [
          {
            id: "career-connect",
            title: "CareerConnect",
            href: "/career-connect/graduates",
            icon: Globe,
          },
          {
            id: "networking",
            title: "Networking",
            href: "/dashboard/networking",
            icon: Users,
          },
          {
            id: "opportunities",
            title: "Opportunities",
            href: "/dashboard/opportunities",
            icon: TrendingUp,
          },
        ],
      },
      {
        id: "settings",
        title: "Settings",
        items: [
          {
            id: "account",
            title: "Account Settings",
            href: "/dashboard/settings",
            icon: Settings,
          },
          {
            id: "preferences",
            title: "Preferences",
            href: "/dashboard/preferences",
            icon: User,
          },
        ],
      },
    ],
    quickActions: [
      {
        id: "enroll-course",
        title: "Enroll Course",
        href: "/training/individual",
        icon: Plus,
      },
      {
        id: "find-mentor",
        title: "Find Mentor",
        href: "/dashboard/mentorship",
        icon: Users,
      },
      {
        id: "update-skills",
        title: "Update Skills",
        href: "/dashboard/skills",
        icon: Target,
      },
    ],
    stats: [
      {
        label: "Active Courses",
        value: 2,
        change: "+1",
        icon: BookOpen,
      },
      {
        label: "Certifications",
        value: 8,
        change: "+2",
        icon: Award,
      },
      {
        label: "Mentorship Hours",
        value: 24,
        change: "+6",
        icon: Users,
      },
      {
        label: "Network Contacts",
        value: 156,
        change: "+12",
        icon: Users,
      },
    ],
  },

  teamTechProfessional: {
    role: "teamTechProfessional",
    displayName: "Team Professional Dashboard",
    description:
      "Team collaboration, project management, and collective growth",
    sections: [
      {
        id: "overview",
        title: "Overview",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            href: "/dashboard/team-tech-professional",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            id: "profile",
            title: "My Profile",
            href: "/dashboard/profile",
            icon: User,
          },
          {
            id: "notifications",
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
            badge: 2,
          },
        ],
      },
      {
        id: "team",
        title: "Team",
        items: [
          {
            id: "team-members",
            title: "Team Members",
            href: "/dashboard/team-members",
            icon: Users,
          },
          {
            id: "projects",
            title: "Projects",
            href: "/dashboard/projects",
            icon: Briefcase,
          },
          {
            id: "collaboration",
            title: "Collaboration",
            href: "/dashboard/collaboration",
            icon: Users,
          },
        ],
      },
      {
        id: "learning",
        title: "Learning",
        items: [
          {
            id: "courses",
            title: "Team Courses",
            href: "/dashboard/courses",
            icon: BookOpen,
          },
          {
            id: "certifications",
            title: "Certifications",
            href: "/training/certifications",
            icon: Award,
          },
          {
            id: "skills",
            title: "Skills Assessment",
            href: "/dashboard/skills",
            icon: Target,
          },
        ],
      },
      {
        id: "settings",
        title: "Settings",
        items: [
          {
            id: "account",
            title: "Account Settings",
            href: "/dashboard/settings",
            icon: Settings,
          },
          {
            id: "team-settings",
            title: "Team Settings",
            href: "/dashboard/team-settings",
            icon: Users,
          },
        ],
      },
    ],
    quickActions: [
      {
        id: "add-team-member",
        title: "Add Team Member",
        href: "/dashboard/team-members/add",
        icon: Plus,
      },
      {
        id: "start-project",
        title: "Start Project",
        href: "/dashboard/projects/new",
        icon: Briefcase,
      },
      {
        id: "enroll-team",
        title: "Enroll Team",
        href: "/training/teams",
        icon: Users,
      },
    ],
    stats: [
      {
        label: "Team Members",
        value: 8,
        change: "+2",
        icon: Users,
      },
      {
        label: "Active Projects",
        value: 3,
        change: "+1",
        icon: Briefcase,
      },
      {
        label: "Team Courses",
        value: 5,
        change: "+2",
        icon: BookOpen,
      },
      {
        label: "Collaboration Hours",
        value: 120,
        change: "+15",
        icon: Clock,
      },
    ],
  },

  recruiter: {
    role: "recruiter",
    displayName: "Recruiter Dashboard",
    description: "Hiring, team management, and talent acquisition",
    sections: [
      {
        id: "overview",
        title: "Overview",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            id: "company",
            title: "Company Profile",
            href: "/dashboard/company",
            icon: Building2,
          },
          {
            id: "notifications",
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
            badge: 7,
          },
        ],
      },
      {
        id: "hiring",
        title: "Hiring",
        items: [
          {
            id: "career-connect",
            title: "CareerConnect",
            href: "/career-connect/employers",
            icon: Globe,
          },
          {
            id: "job-postings",
            title: "Job Postings",
            href: "/dashboard/jobs",
            icon: FileText,
          },
          {
            id: "candidates",
            title: "Candidates",
            href: "/dashboard/candidates",
            icon: Users,
          },
          {
            id: "interviews",
            title: "Interviews",
            href: "/dashboard/interviews",
            icon: Calendar,
          },
        ],
      },
      {
        id: "team",
        title: "Team Management",
        items: [
          {
            id: "employees",
            title: "Employees",
            href: "/dashboard/employees",
            icon: Users,
          },
          {
            id: "training",
            title: "Team Training",
            href: "/training/teams",
            icon: GraduationCap,
          },
          {
            id: "performance",
            title: "Performance",
            href: "/dashboard/performance",
            icon: BarChart3,
          },
        ],
      },
      {
        id: "analytics",
        title: "Analytics",
        items: [
          {
            id: "hiring-stats",
            title: "Hiring Stats",
            href: "/dashboard/hiring-stats",
            icon: BarChart3,
          },
          {
            id: "team-analytics",
            title: "Team Analytics",
            href: "/dashboard/team-analytics",
            icon: TrendingUp,
          },
          {
            id: "reports",
            title: "Reports",
            href: "/dashboard/reports",
            icon: FileText,
          },
        ],
      },
      {
        id: "settings",
        title: "Settings",
        items: [
          {
            id: "account",
            title: "Account Settings",
            href: "/dashboard/settings",
            icon: Settings,
          },
          {
            id: "billing",
            title: "Billing",
            href: "/dashboard/billing",
            icon: CreditCard,
          },
        ],
      },
    ],
    quickActions: [
      {
        id: "post-job",
        title: "Post Job",
        href: "/career-connect/post-job",
        icon: Plus,
      },
      {
        id: "browse-talent",
        title: "Browse Talent",
        href: "/career-connect/talents",
        icon: Search,
      },
      {
        id: "schedule-interview",
        title: "Schedule Interview",
        href: "/dashboard/interviews",
        icon: Calendar,
      },
    ],
    stats: [
      {
        label: "Active Jobs",
        value: 8,
        change: "+2",
        icon: FileText,
      },
      {
        label: "Applications",
        value: 156,
        change: "+23",
        icon: Users,
      },
      {
        label: "Interviews",
        value: 12,
        change: "+4",
        icon: Calendar,
      },
      {
        label: "Hires",
        value: 5,
        change: "+2",
        icon: CheckCircle,
      },
    ],
  },

  admin: {
    role: "admin",
    displayName: "Admin Dashboard",
    description: "System administration and user management",
    sections: [
      {
        id: "overview",
        title: "Overview",
        items: [
          {
            id: "dashboard",
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            id: "profile",
            title: "Admin Profile",
            href: "/dashboard/profile",
            icon: User,
          },
          {
            id: "notifications",
            title: "System Alerts",
            href: "/dashboard/notifications",
            icon: Bell,
            badge: 12,
          },
        ],
      },
      {
        id: "users",
        title: "User Management",
        items: [
          {
            id: "all-users",
            title: "All Users",
            href: "/dashboard/users",
            icon: Users,
          },
          {
            id: "user-roles",
            title: "User Roles",
            href: "/dashboard/user-roles",
            icon: Shield,
          },
          {
            id: "user-activity",
            title: "User Activity",
            href: "/dashboard/user-activity",
            icon: BarChart3,
          },
        ],
      },
      {
        id: "content",
        title: "Content Management",
        items: [
          {
            id: "courses",
            title: "Courses",
            href: "/dashboard/courses",
            icon: BookOpen,
          },
          {
            id: "certifications",
            title: "Certifications",
            href: "/dashboard/certifications",
            icon: Award,
          },
          {
            id: "mentors",
            title: "Mentors",
            href: "/dashboard/mentors",
            icon: Users,
          },
          {
            id: "jobs",
            title: "Job Postings",
            href: "/dashboard/jobs",
            icon: Briefcase,
          },
        ],
      },
      {
        id: "analytics",
        title: "Analytics",
        items: [
          {
            id: "system-stats",
            title: "System Stats",
            href: "/dashboard/system-stats",
            icon: BarChart3,
          },
          {
            id: "reports",
            title: "Reports",
            href: "/dashboard/reports",
            icon: FileText,
          },
          {
            id: "logs",
            title: "System Logs",
            href: "/dashboard/logs",
            icon: FileText,
          },
        ],
      },
      {
        id: "settings",
        title: "Settings",
        items: [
          {
            id: "system-settings",
            title: "System Settings",
            href: "/dashboard/system-settings",
            icon: Settings,
          },
          {
            id: "security",
            title: "Security",
            href: "/dashboard/security",
            icon: Shield,
          },
          {
            id: "backup",
            title: "Backup & Restore",
            href: "/dashboard/backup",
            icon: Download,
          },
        ],
      },
    ],
    quickActions: [
      {
        id: "add-user",
        title: "Add User",
        href: "/dashboard/users/new",
        icon: Plus,
      },
      {
        id: "create-course",
        title: "Create Course",
        href: "/dashboard/courses/new",
        icon: BookOpen,
      },
      {
        id: "system-backup",
        title: "System Backup",
        href: "/dashboard/backup",
        icon: Download,
      },
    ],
    stats: [
      {
        label: "Total Users",
        value: 1247,
        change: "+23",
        icon: Users,
      },
      {
        label: "Active Courses",
        value: 45,
        change: "+3",
        icon: BookOpen,
      },
      {
        label: "System Health",
        value: "98%",
        change: "+2%",
        icon: CheckCircle,
      },
      {
        label: "Revenue",
        value: "$45.2K",
        change: "+12%",
        icon: TrendingUp,
      },
    ],
  },
};

export const getUserDashboardData = (role: UserRole): RoleDashboardData => {
  return dashboardData[role] || dashboardData.student;
};

export const getAllRoles = (): UserRole[] => {
  return Object.keys(dashboardData) as UserRole[];
};
