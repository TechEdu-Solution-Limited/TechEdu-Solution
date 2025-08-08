"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  RefreshCw,
  Ban,
  Unlock,
  Key,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data
const mockUsers = [
  // Students
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
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    role: "student",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+1 (415) 555-0123",
    location: "San Francisco, CA",
    institution: "Stanford University",
    course: "Data Science",
    year: "2nd Year",
    joinDate: "2023-08-20",
    lastActive: "2024-01-15 10:15:00",
    verified: true,
    coursesEnrolled: 4,
    completedCourses: 2,
    gpa: "3.9",
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    role: "student",
    status: "inactive",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+44 20 7946 0958",
    location: "London, UK",
    institution: "University of Oxford",
    course: "Economics",
    year: "4th Year",
    joinDate: "2022-09-10",
    lastActive: "2023-12-20 16:45:00",
    verified: true,
    coursesEnrolled: 6,
    completedCourses: 5,
    gpa: "3.7",
  },
  // Professionals
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
    id: "5",
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@email.com",
    role: "individualTechProfessional",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+1 (212) 555-0456",
    location: "New York, NY",
    institution: "New York University",
    course: "Marketing",
    year: "Graduate",
    joinDate: "2021-06-10",
    lastActive: "2024-01-15 09:30:00",
    verified: true,
    experience: "4 years",
    skills: ["Digital Marketing", "Google Ads", "Analytics"],
    currentCompany: "Digital Agency NYC",
    position: "Marketing Manager",
  },
  // Recruiters
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
    id: "7",
    name: "Olivia Brown",
    email: "olivia.brown@email.com",
    role: "recruiter",
    status: "pending",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+1 (416) 555-0789",
    location: "Toronto, Canada",
    institution: "University of Toronto",
    course: "Business Administration",
    year: "Graduate",
    joinDate: "2024-01-10",
    lastActive: "2024-01-15 08:15:00",
    verified: false,
    company: "Canadian Tech Solutions",
    position: "HR Specialist",
    jobsPosted: 0,
    successfulHires: 0,
  },
  // Institutions
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
  {
    id: "9",
    name: "Digital Skills Academy",
    email: "info@digitalskills.academy",
    role: "institution",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+1 (555) 123-4567",
    location: "Austin, TX",
    institution: "Digital Skills Academy",
    course: "Professional Training",
    year: "Established 2018",
    joinDate: "2021-03-20",
    lastActive: "2024-01-15 15:10:00",
    verified: true,
    studentsEnrolled: 800,
    coursesOffered: 20,
    accreditation: "State Certified",
    type: "Training Institute",
  },
  {
    id: "10",
    name: "Global Learning Center",
    email: "contact@globallearning.edu",
    role: "institution",
    status: "suspended",
    avatar: "/assets/placeholder-avatar.jpg",
    phone: "+44 20 1234 5678",
    location: "London, UK",
    institution: "Global Learning Center",
    course: "International Education",
    year: "Established 2010",
    joinDate: "2019-07-10",
    lastActive: "2023-11-30 10:30:00",
    verified: true,
    studentsEnrolled: 1200,
    coursesOffered: 35,
    accreditation: "UK Accredited",
    type: "International School",
  },
];

const userTypes = [
  { key: "student", label: "Students", icon: GraduationCap },
  { key: "professional", label: "Professionals", icon: Briefcase },
  { key: "recruiter", label: "Recruiters", icon: Users },
  { key: "institution", label: "Institutions", icon: Building2 },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  inactive: "bg-gray-100 text-gray-800",
};

export default function AdminUserManagementPage() {
  const [activeTab, setActiveTab] = useState("student");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
    setPage(1);
  }, [users, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const verifiedUsers = users.filter((u) => u.verified).length;
  const newUsersThisMonth = users.filter((u) => {
    const joinDate = new Date(u.joinDate);
    const now = new Date();
    return (
      joinDate.getMonth() === now.getMonth() &&
      joinDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete));
      setUserToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "individualTechProfessional":
        return <Briefcase className="w-4 h-4" />;
      case "recruiter":
        return <Users className="w-4 h-4" />;
      case "institution":
        return <Building2 className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      student: "bg-blue-100 text-blue-800",
      individualTechProfessional: "bg-green-100 text-green-800",
      recruiter: "bg-purple-100 text-purple-800",
      institution: "bg-orange-100 text-orange-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all users across the platform
          </p>
        </div>
        <div className="flex gap-3 pt-4 md:pt-0">
          <Button variant="outline" className="rounded-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          <Button className="bg-[#0D1140] hover:bg-blue-700 text-white rounded-[10px]">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Tabs for user types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full">
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger
                key={type.key}
                value={type.key}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" /> {type.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-[10px]">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {totalUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-[10px]">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {activeUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-[10px]">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified Users</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {verifiedUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {newUsersThisMonth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-[10px]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 rounded-[10px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-[10px] bg-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name & Email</TableHead>
                  <TableHead>Role</TableHead>
                  {activeTab === "student" && (
                    <TableHead>Institution</TableHead>
                  )}
                  {activeTab === "professional" && (
                    <TableHead>Company</TableHead>
                  )}
                  {activeTab === "recruiter" && <TableHead>Company</TableHead>}
                  {activeTab === "institution" && (
                    <TableHead>Location</TableHead>
                  )}
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            {user.role}
                          </Badge>
                        </div>
                      </TableCell>
                      {activeTab === "student" && (
                        <TableCell>{user.institution}</TableCell>
                      )}
                      {activeTab === "professional" && (
                        <TableCell>{user.currentCompany}</TableCell>
                      )}
                      {activeTab === "recruiter" && (
                        <TableCell>{user.company}</TableCell>
                      )}
                      {activeTab === "institution" && (
                        <TableCell>{user.location}</TableCell>
                      )}
                      <TableCell>
                        <Badge
                          className={
                            statusColors[
                              user.status as keyof typeof statusColors
                            ] || "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white rounded-[10px]"
                          >
                            <DropdownMenuItem
                              asChild
                              className="cursor-pointer"
                            >
                              <Link
                                href={`/dashboard/user-management/${user.id}`}
                              >
                                <Eye className="w-4 h-4 mr-2" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20 rounded-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-[10px]">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
