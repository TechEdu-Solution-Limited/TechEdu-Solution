import {
  Home,
  User,
  BookOpen,
  FileText,
  Briefcase,
  ClipboardList,
  Layers,
  ShoppingCart,
  MessageCircle,
  Bell,
  Building2,
  Users,
  Target,
  Settings,
  Calendar,
  CheckCircle,
  UserCheck,
  Search,
  FileCheck,
  Clipboard,
  BarChart3,
  Award,
} from "lucide-react";
import { HiViewBoards } from "react-icons/hi";

const teamTechProfessionalMemberMenus = [
  { label: "Dashboard", icon: Home, href: "/dashboard/team-tech-professional" },
  {
    label: "My Role",
    icon: User,
    href: "/dashboard/team-tech-professional/my-role",
  },
  {
    label: "Company Status",
    icon: Building2,
    href: "/dashboard/team-tech-professional/company-status",
  },
  {
    label: "Tasks",
    icon: ClipboardList,
    href: "/dashboard/team-tech-professional/tasks",
  },
  { label: "Projects", icon: Layers, href: "/dashboard/projects" },
  {
    label: "Communication",
    icon: MessageCircle,
    href: "/dashboard/team-tech-professional/communication",
  },
  {
    label: "Team Training Assignments",
    icon: BookOpen,
    href: "/dashboard/training",
  },
  {
    label: "Performance Tracker",
    icon: Target,
    href: "/dashboard/performance",
  },
  {
    label: "My Profile",
    icon: User,
    href: "/dashboard/team-tech-professional/profile",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/dashboard/notifications",
  },
];

const teamTechProfessionalAdminMenus = [
  ...teamTechProfessionalMemberMenus,
  {
    label: "Team Management",
    icon: Settings,
    href: "/dashboard/team-tech-professional/team-management",
    adminOnly: true,
  },
  {
    label: "Team Members",
    icon: Users,
    href: "/dashboard/team-members",
    adminOnly: true,
  },
  {
    label: "Feedback Tools",
    icon: MessageCircle,
    href: "/dashboard/team-tech-professional/feedback",
    adminOnly: true,
  },
];

export const dashboardSidebarConfig = {
  student: {
    displayName: "Student Dashboard",
    sections: [
      {
        title: "Main",
        items: [
          { label: "Dashboard", icon: Home, href: "/dashboard/student" },
          {
            label: "Profile Progress",
            icon: UserCheck,
            href: "/dashboard/profile-progress",
          },
          {
            label: "My Bookings",
            icon: BookOpen,
            href: "/dashboard/bookings",
          },
          // {
          //   label: "Book Services",
          //   icon: BookOpen,
          //   href: "/dashboard/bookings/academic/new",
          // },
          {
            label: "Upload Documents",
            icon: FileCheck,
            href: "/dashboard/upload-documents",
          },
          {
            label: "Classroom",
            icon: HiViewBoards,
            href: "/dashboard/classroom",
          },
          {
            label: "My Sessions",
            icon: Calendar,
            href: "/dashboard/sessions/my-sessions",
          },
          {
            label: "My Attendance",
            icon: FileText,
            href: "/dashboard/attendance/my-attendance",
          },
          {
            label: "Orders & Payments",
            icon: ShoppingCart,
            href: "/dashboard/payments",
          },
        ],
      },
      {
        title: "Learning & Progress",
        items: [
          {
            label: "Service Access Summary",
            icon: Clipboard,
            href: "/dashboard/service-access",
          },
          {
            label: "Track Review",
            icon: ClipboardList,
            href: "/dashboard/track-review",
          },
          {
            label: "Learning Goals",
            icon: Target,
            href: "/dashboard/learning-goals",
          },
        ],
      },
      {
        title: "Communication & Support",
        items: [
          {
            label: "Announcements",
            icon: MessageCircle,
            href: "/dashboard/announcements",
          },
          { label: "Mentors", icon: User, href: "/dashboard/mentors" },
          {
            label: "Notifications",
            icon: Bell,
            href: "/dashboard/notifications",
          },
          { label: "Resources", icon: Layers, href: "/dashboard/resources" },
          { label: "Support", icon: MessageCircle, href: "/dashboard/support" },
        ],
      },
    ],
  },

  individualTechProfessional: {
    displayName: "Professional Dashboard",
    sections: [
      {
        title: "Main",
        items: [
          {
            label: "Dashboard",
            icon: Home,
            href: "/dashboard/individual-tech-professional",
          },
          // {
          //   label: "Skill Graph",
          //   icon: BarChart3,
          //   href: "/dashboard/skill-graph",
          // },
          // {
          //   label: "Career Snapshot",
          //   icon: Target,
          //   href: "/dashboard/career-snapshot",
          // },
          {
            label: "My Bookings",
            icon: BookOpen,
            href: "/dashboard/bookings",
          },
          {
            label: "My Attendance",
            icon: FileText,
            href: "/dashboard/attendance/my-attendance",
          },
          {
            label: "Training Programs",
            icon: BookOpen,
            href: "/dashboard/training",
          },
          {
            label: "Certifications",
            icon: Award,
            href: "/dashboard/certifications",
          },
          // {
          //   label: "My Classroom",
          //   icon: BookOpen,
          //   href: "/dashboard/my-classroom",
          // },
          // {
          //   label: "My Sessions",
          //   icon: Calendar,
          //   href: "/dashboard/sessions/my-sessions",
          // },
        ],
      },
      {
        title: "Career Tools",
        items: [
          {
            label: "CV Builder",
            icon: FileText,
            href: "/dashboard/cv-builder",
          },
          // {
          //   label: "AI Suggestions",
          //   icon: Target,
          //   href: "/dashboard/cv-builder/ai-suggestions",
          // },
          // {
          //   label: "Final Resume",
          //   icon: FileText,
          //   href: "/dashboard/cv-builder/final",
          // },
          { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
          {
            label: "My Applications",
            icon: ClipboardList,
            href: "/dashboard/applications",
          },
          // {
          //   label: "Recommendations",
          //   icon: Search,
          //   href: "/dashboard/recommendations",
          // },
          // {
          //   label: "Career Tools",
          //   icon: Search,
          //   href: "/dashboard/career-tools",
          // },
          // {
          //   label: "CV Analysis",
          //   icon: FileText,
          //   href: "/dashboard/cv-analysis",
          // },
          // {
          //   label: "Match Score",
          //   icon: Target,
          //   href: "/dashboard/match-score",
          // },
          // { label: "AI Tips", icon: MessageCircle, href: "/dashboard/ai-tips" },
        ],
      },
      {
        title: "Communication & Support",
        items: [
          {
            label: "Notifications",
            icon: Bell,
            href: "/dashboard/notifications",
          },
          // { label: "Resources", icon: Layers, href: "/dashboard/resources" },
          {
            label: "Orders & Payments",
            icon: ShoppingCart,
            href: "/dashboard/payments",
          },
          // { label: "Support", icon: MessageCircle, href: "/dashboard/support" },
        ],
      },
    ],
  },

  teamTechProfessional: {
    displayName: "Team Professional Dashboard",
    getSections: (isAdmin: boolean) => [
      {
        title: "Main",
        items: isAdmin
          ? [
              {
                label: "Dashboard",
                icon: Home,
                href: "/dashboard/team-tech-professional",
              },
              {
                label: "My Role",
                icon: User,
                href: "/dashboard/team-tech-professional/my-role",
              },
              // {
              //   label: "Company Status",
              //   icon: Building2,
              //   href: "/dashboard/team-tech-professional/company-status",
              // },
              {
                label: "Tasks",
                icon: ClipboardList,
                href: "/dashboard/team-tech-professional/tasks",
              },
              { label: "Projects", icon: Layers, href: "/dashboard/projects" },
              {
                label: "Communication",
                icon: MessageCircle,
                href: "/dashboard/team-tech-professional/communication",
              },
              {
                label: "Team Training Assignments",
                icon: BookOpen,
                href: "/dashboard/training",
              },
              {
                label: "Performance Tracker",
                icon: Target,
                href: "/dashboard/performance",
              },
              {
                label: "My Profile",
                icon: User,
                href: "/dashboard/team-tech-professional/profile",
              },
              {
                label: "Team Management",
                icon: Settings,
                href: "/dashboard/team-tech-professional/team-management",
              },
              {
                label: "Team Members",
                icon: Users,
                href: "/dashboard/team-members",
              },
              {
                label: "My Courses",
                icon: BookOpen,
                href: "/dashboard/courses",
              },
              {
                label: "Bookings",
                icon: BookOpen,
                href: "/dashboard/bookings/training/new",
              },
              {
                label: "Payments",
                icon: BookOpen,
                href: "/dashboard/payments",
              },
              {
                label: "Feedback Tools",
                icon: MessageCircle,
                href: "/dashboard/team-tech-professional/feedback",
              },
              {
                label: "Notifications",
                icon: Bell,
                href: "/dashboard/notifications",
              },
              {
                label: "Resources",
                icon: Layers,
                href: "/dashboard/resources",
              },
              {
                label: "Support",
                icon: MessageCircle,
                href: "/dashboard/support",
              },
            ]
          : [
              {
                label: "Dashboard",
                icon: Home,
                href: "/dashboard/team-tech-professional",
              },
              {
                label: "My Role",
                icon: User,
                href: "/dashboard/team-tech-professional/my-role",
              },
              {
                label: "Company Status",
                icon: Building2,
                href: "/dashboard/team-tech-professional/company-status",
              },
              {
                label: "Tasks",
                icon: ClipboardList,
                href: "/dashboard/team-tech-professional/tasks",
              },
              { label: "Projects", icon: Layers, href: "/dashboard/projects" },
              {
                label: "Communication",
                icon: MessageCircle,
                href: "/dashboard/team-tech-professional/communication",
              },
              {
                label: "Team Training Assignments",
                icon: BookOpen,
                href: "/dashboard/training",
              },
              {
                label: "Performance Tracker",
                icon: Target,
                href: "/dashboard/performance",
              },
              {
                label: "My Profile",
                icon: User,
                href: "/dashboard/team-tech-professional/profile",
              },
              {
                label: "Notifications",
                icon: Bell,
                href: "/dashboard/notifications",
              },
              {
                label: "Resources",
                icon: Layers,
                href: "/dashboard/resources",
              },
              {
                label: "Support",
                icon: MessageCircle,
                href: "/dashboard/support",
              },
            ],
      },
    ],
  },

  recruiter: {
    displayName: "Recruiter Dashboard",
    sections: [
      {
        title: "Main",
        items: [
          { label: "Dashboard", icon: Home, href: "/dashboard/recruiter" },
          {
            label: "Post a job",
            icon: FileText,
            href: "/dashboard/jobs-management/new",
          },
          {
            label: "Jobs Posted",
            icon: Briefcase,
            href: "/dashboard/jobs-management",
          },
          {
            label: "Applications",
            icon: ClipboardList,
            href: "/dashboard/applications",
          },
          {
            label: "Talents",
            icon: Users,
            href: "/dashboard/talents",
          },
          {
            label: "Interviews",
            icon: Calendar,
            href: "/dashboard/interviews",
          },
          // {
          //   label: "Candidate Pipeline",
          //   icon: Layers,
          //   href: "/dashboard/recruiter/pipeline",
          // },
          {
            label: "CV Matching",
            icon: Search,
            href: "/dashboard/cv-matching",
          },
          {
            label: "Notes & Feedback",
            icon: MessageCircle,
            href: "/dashboard/notes-feedback",
          },
          {
            label: "Company Profile",
            icon: Building2,
            href: "/dashboard/profile",
          },
          {
            label: "Notifications",
            icon: Bell,
            href: "/dashboard/notifications",
          },
        ],
      },
      {
        title: "Support",
        items: [
          { label: "Resources", icon: Layers, href: "/dashboard/resources" },
          { label: "Support", icon: MessageCircle, href: "/dashboard/support" },
        ],
      },
    ],
  },

  institution: {
    displayName: "Institution Dashboard",
    sections: [
      {
        title: "Main",
        items: [
          { label: "Dashboard", icon: Home, href: "/dashboard/institution" },
          {
            label: "Talent Management",
            icon: Users,
            href: "/dashboard/talent-management",
          },
          {
            label: "Uploads & Verification",
            icon: FileCheck,
            href: "/dashboard/uploads",
          },
          {
            label: "Academic Services",
            icon: UserCheck,
            href: "/dashboard/services",
          },
          {
            label: "Reports & Analytics",
            icon: BarChart3,
            href: "/dashboard/reports",
          },
          {
            label: "Instructors",
            icon: UserCheck,
            href: "/dashboard/instructors",
          },
          {
            label: "Manage Students",
            icon: Users,
            href: "/dashboard/students",
          },
          {
            label: "Courses",
            icon: BookOpen,
            href: "/dashboard/courses-management",
          },
          {
            label: "Orders & Payments",
            icon: ShoppingCart,
            href: "/dashboard/payments",
          },
          {
            label: "Notifications",
            icon: Bell,
            href: "/dashboard/notifications",
          },
        ],
      },
      {
        title: "Support",
        items: [
          { label: "Resources", icon: Layers, href: "/dashboard/resources" },
          {
            label: "Feedback / Support",
            icon: MessageCircle,
            href: "/dashboard/support",
          },
        ],
      },
    ],
  },
};
