"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Ban,
  GraduationCap,
  Building2,
  Briefcase,
  ArrowUpDown,
  Download,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "student"
    | "individualTechProfessional"
    | "company"
    | "institution"
    | "admin";
  status: "active" | "inactive" | "pending" | "suspended";
  avatar: string;
  location: string;
  phone: string;
  joinDate: string;
  lastActive: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  certifications: number;
  department?: string;
  company?: string;
  institution?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "student",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    location: "London, UK",
    phone: "+44 20 7123 4567",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    coursesEnrolled: 5,
    coursesCompleted: 3,
    certifications: 2,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@techcorp.com",
    role: "individualTechProfessional",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    location: "Manchester, UK",
    phone: "+44 161 234 5678",
    joinDate: "2023-12-10",
    lastActive: "2024-01-19",
    coursesEnrolled: 8,
    coursesCompleted: 6,
    certifications: 4,
    company: "TechCorp Solutions",
  },
  {
    id: "3",
    name: "TechEdu Solutions",
    email: "hr@techedu.com",
    role: "company",
    status: "active",
    avatar: "/assets/logo.png",
    location: "Birmingham, UK",
    phone: "+44 121 345 6789",
    joinDate: "2023-11-20",
    lastActive: "2024-01-20",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certifications: 0,
    company: "TechEdu Solutions",
  },
  {
    id: "4",
    name: "Global University",
    email: "admin@globaluniversity.edu.uk",
    role: "institution",
    status: "active",
    avatar: "/assets/logo.png",
    location: "Edinburgh, UK",
    phone: "+44 131 456 7890",
    joinDate: "2023-10-15",
    lastActive: "2024-01-18",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certifications: 0,
    institution: "Global University",
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@techedu.com",
    role: "admin",
    status: "active",
    avatar: "/assets/placeholder-avatar.jpg",
    location: "Leeds, UK",
    phone: "+44 113 567 8901",
    joinDate: "2023-09-01",
    lastActive: "2024-01-20",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certifications: 0,
    department: "IT & Operations",
  },
  {
    id: "6",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@email.com",
    role: "student",
    status: "pending",
    avatar: "/assets/placeholder-avatar.jpg",
    location: "Liverpool, UK",
    phone: "+44 151 678 9012",
    joinDate: "2024-01-18",
    lastActive: "2024-01-18",
    coursesEnrolled: 2,
    coursesCompleted: 0,
    certifications: 0,
  },
  {
    id: "7",
    name: "David Wilson",
    email: "david.wilson@startup.com",
    role: "individualTechProfessional",
    status: "inactive",
    avatar: "/assets/placeholder-avatar.jpg",
    location: "Bristol, UK",
    phone: "+44 117 789 0123",
    joinDate: "2023-08-15",
    lastActive: "2023-12-20",
    coursesEnrolled: 3,
    coursesCompleted: 2,
    certifications: 1,
    company: "Startup Inc",
  },
  {
    id: "8",
    name: "Innovation Corp",
    email: "contact@innovationcorp.com",
    role: "company",
    status: "suspended",
    avatar: "/assets/logo.png",
    location: "Cardiff, UK",
    phone: "+44 29 890 1234",
    joinDate: "2023-07-10",
    lastActive: "2024-01-10",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certifications: 0,
    company: "Innovation Corp",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "individualTechProfessional":
        return <Briefcase className="w-4 h-4" />;
      case "company":
        return <Building2 className="w-4 h-4" />;
      case "institution":
        return <Building2 className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "individualTechProfessional":
        return "bg-green-100 text-green-800";
      case "company":
        return "bg-purple-100 text-purple-800";
      case "institution":
        return "bg-orange-100 text-orange-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleBulkAction = (action: string) => {
    // Handle bulk actions
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="text-white hover:text-black">
            <Link href="/dashboard/users/new">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-[10px]">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.suspended}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="individualTechProfessional">
                  Professionals
                </SelectItem>
                <SelectItem value="company">Companies</SelectItem>
                <SelectItem value="institution">Institutions</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">
                  {selectedUsers.length} user(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("activate")}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("suspend")}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      User
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("role")}
                      className="h-auto p-0 font-semibold"
                    >
                      Role
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="h-auto p-0 font-semibold"
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("joinDate")}
                      className="h-auto p-0 font-semibold"
                    >
                      Joined
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) =>
                          handleSelectUser(user.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-[#011F72]">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {user.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {user.joinDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {user.lastActive}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(user.role === "student" ||
                        user.role === "individualTechProfessional") && (
                        <div className="text-sm">
                          <div className="text-gray-600">
                            {user.coursesCompleted}/{user.coursesEnrolled}{" "}
                            courses
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.certifications} certifications
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/users/${user.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        {/* <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {sortedUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Button asChild>
                <Link href="/dashboard/users/new">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New User
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
