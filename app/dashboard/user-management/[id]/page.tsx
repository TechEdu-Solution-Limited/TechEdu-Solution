"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Users,
  Briefcase,
  Building2,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Ban,
  Unlock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Download,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

// Mock user data (should match the main list for demo)
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "student",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    institution: "University of Lagos",
    course: "Computer Science",
    year: "3rd Year",
    joinDate: "2023-09-15",
    lastActive: "2024-01-15 14:30:00",
    verified: true,
    coursesEnrolled: 5,
    completedCourses: 3,
    gpa: "3.8",
  },
  {
    id: "4",
    name: "David Patel",
    email: "david.patel@email.com",
    role: "individualTechProfessional",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    institution: "Indian Institute of Technology",
    course: "Software Engineering",
    year: "Graduate",
    joinDate: "2022-03-15",
    lastActive: "2024-01-15 12:20:00",
    verified: true,
    experience: "3 years",
    skills: ["React", "Node.js", "Python"],
    currentCompany: "TechCorp India",
    position: "Senior Developer",
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@email.com",
    role: "recruiter",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+44 161 496 0123",
    location: "Manchester, UK",
    institution: "University of Manchester",
    course: "Human Resources",
    year: "Graduate",
    joinDate: "2020-09-05",
    lastActive: "2024-01-15 11:45:00",
    verified: true,
    company: "TechRecruit Ltd",
    position: "Senior Recruiter",
    jobsPosted: 25,
    successfulHires: 18,
  },
  {
    id: "8",
    name: "TechEdu University",
    email: "admin@techedu.edu",
    role: "institution",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+234 1 234 5678",
    location: "Lagos, Nigeria",
    institution: "TechEdu University",
    course: "Higher Education",
    year: "Established 2015",
    joinDate: "2020-01-15",
    lastActive: "2024-01-15 13:20:00",
    verified: true,
    studentsEnrolled: 2500,
    coursesOffered: 45,
    accreditation: "NUC Approved",
    type: "University",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
};

export default function AdminUserProfilePage() {
  const params = useParams();
  const user = mockUsers.find((u) => u.id === params.id);
  if (!user) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex gap-2 mb-4">
        <Button asChild variant="outline" className="rounded-[10px] flex gap-2">
          <Link href="/dashboard/user-management">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-[#011F72]">{user.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              className={
                statusColors[user.status as keyof typeof statusColors] ||
                "bg-gray-100 text-gray-800"
              }
            >
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Badge>
            {user.verified && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" /> Verified
              </Badge>
            )}
            <Badge className="bg-blue-100 text-blue-800 capitalize">
              {user.role}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" /> {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" /> {user.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {user.location}
            </span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="rounded-[10px]">
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="mb-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-1">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Role</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  <Badge
                    className={
                      statusColors[user.status as keyof typeof statusColors] ||
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Joined</p>
                  <p className="font-medium">{user.joinDate}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Last Active</p>
                  <p className="font-medium">{user.lastActive}</p>
                </div>
                {user.role === "student" && (
                  <>
                    <div>
                      <p className="text-gray-600 mb-1">Institution</p>
                      <p className="font-medium">{user.institution}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Course</p>
                      <p className="font-medium">{user.course}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Year</p>
                      <p className="font-medium">{user.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">GPA</p>
                      <p className="font-medium">{user.gpa}</p>
                    </div>
                  </>
                )}
                {user.role === "individualTechProfessional" && (
                  <>
                    <div>
                      <p className="text-gray-600 mb-1">Company</p>
                      <p className="font-medium">{user.currentCompany}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Position</p>
                      <p className="font-medium">{user.position}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Experience</p>
                      <p className="font-medium">{user.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Skills</p>
                      <p className="font-medium">{user.skills?.join(", ")}</p>
                    </div>
                  </>
                )}
                {user.role === "recruiter" && (
                  <>
                    <div>
                      <p className="text-gray-600 mb-1">Company</p>
                      <p className="font-medium">{user.company}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Position</p>
                      <p className="font-medium">{user.position}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Jobs Posted</p>
                      <p className="font-medium">{user.jobsPosted}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Successful Hires</p>
                      <p className="font-medium">{user.successfulHires}</p>
                    </div>
                  </>
                )}
                {user.role === "institution" && (
                  <>
                    <div>
                      <p className="text-gray-600 mb-1">Type</p>
                      <p className="font-medium">{user.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Accreditation</p>
                      <p className="font-medium">{user.accreditation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Students Enrolled</p>
                      <p className="font-medium">{user.studentsEnrolled}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Courses Offered</p>
                      <p className="font-medium">{user.coursesOffered}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Activity logs and actions will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                User-specific settings and permissions will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
