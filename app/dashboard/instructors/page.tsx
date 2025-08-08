"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  MessageCircle,
  RefreshCw,
  Star,
  BookOpen,
  UserCheck,
  CheckCircle,
} from "lucide-react";

interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "inactive" | "pending";
  rating: number;
  courses: string[];
  students: number;
}

interface Course {
  id: string;
  name: string;
}

const mockInstructors: Instructor[] = [
  {
    id: "1",
    name: "Dr. Michael Chen",
    email: "michael.chen@university.edu",
    avatar: "/avatars/mike.jpg",
    status: "active",
    rating: 4.8,
    courses: ["Advanced Web Development"],
    students: 45,
  },
  {
    id: "2",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    avatar: "/avatars/emily.jpg",
    status: "active",
    rating: 4.6,
    courses: ["Data Science Fundamentals"],
    students: 38,
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    avatar: "/avatars/sarah.jpg",
    status: "inactive",
    rating: 4.9,
    courses: ["Cybersecurity Essentials"],
    students: 32,
  },
  {
    id: "4",
    name: "Dr. David Kim",
    email: "david.kim@university.edu",
    avatar: "/avatars/david.jpg",
    status: "pending",
    rating: 4.7,
    courses: ["Artificial Intelligence & Machine Learning"],
    students: 28,
  },
];

const mockCourses: Course[] = [
  { id: "1", name: "Advanced Web Development" },
  { id: "2", name: "Data Science Fundamentals" },
  { id: "3", name: "Cybersecurity Essentials" },
  { id: "4", name: "Artificial Intelligence & Machine Learning" },
];

export default function InstructorsPage() {
  // Assign tab state
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [assigned, setAssigned] = useState(false);

  // Reassign tab state (placeholder logic)
  const [selectedReInstructor, setSelectedReInstructor] = useState<string>("");
  const [selectedReCourse, setSelectedReCourse] = useState<string>("");
  const [reassigned, setReassigned] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAssign = () => {
    if (selectedInstructor && selectedCourse) {
      setAssigned(true);
      setTimeout(() => setAssigned(false), 2000);
    }
  };

  const handleReassign = () => {
    if (selectedReInstructor && selectedReCourse) {
      setReassigned(true);
      setTimeout(() => setReassigned(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Instructors</h1>
          <p className="text-gray-600 mt-2">
            Manage all instructors, assignments, and monitoring in one place.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Instructors</TabsTrigger>
          <TabsTrigger value="assign">Assign</TabsTrigger>
          <TabsTrigger value="reassign">Reassign</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockInstructors.map((inst) => (
              <Card key={inst.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={inst.avatar} />
                      <AvatarFallback>
                        {inst.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{inst.name}</h3>
                      <p className="text-gray-600 text-sm">{inst.email}</p>
                      <p className="text-gray-500 text-xs">
                        Courses: {inst.courses.join(", ")}
                      </p>
                    </div>
                    <Badge className={getStatusColor(inst.status)}>
                      {inst.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{inst.students} students</span>
                    <span className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {inst.rating}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="assign" className="space-y-6 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Assign Instructor</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Instructor
                </label>
                <Select
                  value={selectedInstructor}
                  onValueChange={setSelectedInstructor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInstructors.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={inst.avatar} />
                            <AvatarFallback>
                              {inst.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{inst.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Course
                </label>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose course" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>{course.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAssign}
                disabled={!selectedInstructor || !selectedCourse}
                className="w-full mt-2"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Assign Instructor
              </Button>
              {assigned && (
                <div className="flex items-center text-green-700 mt-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Instructor assigned successfully!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reassign" className="space-y-6 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Reassign Instructor</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Instructor
                </label>
                <Select
                  value={selectedReInstructor}
                  onValueChange={setSelectedReInstructor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInstructors.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={inst.avatar} />
                            <AvatarFallback>
                              {inst.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{inst.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select New Course
                </label>
                <Select
                  value={selectedReCourse}
                  onValueChange={setSelectedReCourse}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose course" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>{course.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleReassign}
                disabled={!selectedReInstructor || !selectedReCourse}
                className="w-full mt-2"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Reassign Instructor
              </Button>
              {reassigned && (
                <div className="flex items-center text-green-700 mt-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Instructor reassigned successfully!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monitor" className="space-y-6">
          <h2 className="text-xl font-semibold mb-2">Monitor Activity</h2>
          <Card>
            <CardContent className="p-6 text-gray-500">
              <p>
                Instructor activity logs and analytics will appear here.
                (Placeholder)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
