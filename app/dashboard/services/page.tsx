"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, RefreshCw, Eye, MessageCircle, Star } from "lucide-react";

// Academic Coaching
interface CoachingSession {
  id: string;
  studentName: string;
  studentAvatar: string;
  coachName: string;
  coachAvatar: string;
  topic: string;
  date: string;
  status: "completed" | "scheduled" | "cancelled";
  feedback: string;
  rating: number;
}

// Consulting
interface ConsultingSession {
  id: string;
  clientName: string;
  clientAvatar: string;
  consultantName: string;
  consultantAvatar: string;
  topic: string;
  date: string;
  status: "completed" | "scheduled" | "cancelled";
  feedback: string;
}

// Bookings
interface Booking {
  id: string;
  title: string;
  type: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  bookedBy: string;
  bookedByAvatar: string;
  notes: string;
}

const mockCoaching: CoachingSession[] = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    studentAvatar: "/avatars/sarah.jpg",
    coachName: "Dr. Michael Chen",
    coachAvatar: "/avatars/mike.jpg",
    topic: "Time Management",
    date: "2024-06-08T09:00:00Z",
    status: "completed",
    feedback: "Very helpful session!",
    rating: 5,
  },
  {
    id: "2",
    studentName: "Mike Chen",
    studentAvatar: "/avatars/mike.jpg",
    coachName: "Dr. Emily Rodriguez",
    coachAvatar: "/avatars/emily.jpg",
    topic: "Exam Preparation",
    date: "2024-06-12T11:00:00Z",
    status: "scheduled",
    feedback: "",
    rating: 0,
  },
  {
    id: "3",
    studentName: "Emily Rodriguez",
    studentAvatar: "/avatars/emily.jpg",
    coachName: "Dr. Sarah Johnson",
    coachAvatar: "/avatars/sarah.jpg",
    topic: "Research Skills",
    date: "2024-06-15T15:00:00Z",
    status: "cancelled",
    feedback: "Session cancelled by student.",
    rating: 0,
  },
];

const mockConsulting: ConsultingSession[] = [
  {
    id: "1",
    clientName: "TechCorp Inc.",
    clientAvatar: "/avatars/john.jpg",
    consultantName: "Dr. Michael Chen",
    consultantAvatar: "/avatars/mike.jpg",
    topic: "Digital Transformation",
    date: "2024-06-09T10:00:00Z",
    status: "completed",
    feedback: "Great insights and actionable plan!",
  },
  {
    id: "2",
    clientName: "DesignStudio Inc.",
    clientAvatar: "/avatars/maria.jpg",
    consultantName: "Dr. Emily Rodriguez",
    consultantAvatar: "/avatars/emily.jpg",
    topic: "UX Strategy",
    date: "2024-06-13T13:00:00Z",
    status: "scheduled",
    feedback: "",
  },
  {
    id: "3",
    clientName: "CloudTech Solutions",
    clientAvatar: "/avatars/alex.jpg",
    consultantName: "Dr. Sarah Johnson",
    consultantAvatar: "/avatars/sarah.jpg",
    topic: "Cloud Migration",
    date: "2024-06-16T15:30:00Z",
    status: "cancelled",
    feedback: "Session cancelled by client.",
  },
];

const mockBookings: Booking[] = [
  {
    id: "1",
    title: "Career Coaching Session",
    type: "Coaching",
    date: "2024-06-10T14:00:00Z",
    status: "confirmed",
    bookedBy: "Sarah Johnson",
    bookedByAvatar: "/avatars/sarah.jpg",
    notes: "Discuss career path and upskilling.",
  },
  {
    id: "2",
    title: "CV Review Appointment",
    type: "CV Review",
    date: "2024-06-12T10:30:00Z",
    status: "pending",
    bookedBy: "Mike Chen",
    bookedByAvatar: "/avatars/mike.jpg",
    notes: "Review and feedback on CV.",
  },
  {
    id: "3",
    title: "Mock Interview",
    type: "Interview",
    date: "2024-06-15T16:00:00Z",
    status: "cancelled",
    bookedBy: "Emily Rodriguez",
    bookedByAvatar: "/avatars/emily.jpg",
    notes: "Cancelled by user.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "scheduled":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Academic Services
          </h1>
          <p className="text-gray-600 mt-2">
            Manage coaching, consulting, and bookings in one place.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="coaching" className="space-y-6">
        <TabsList>
          <TabsTrigger value="coaching">Academic Coaching</TabsTrigger>
          <TabsTrigger value="consulting">Consulting</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        {/* Academic Coaching */}
        <TabsContent value="coaching" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCoaching.map((session) => (
              <Card
                key={session.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session.studentAvatar} />
                      <AvatarFallback>
                        {session.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{session.topic}</h3>
                      <p className="text-gray-600 text-sm">
                        Coach: {session.coachName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Student: {session.studentName}
                      </p>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(session.date).toLocaleString()}</span>
                    {session.rating > 0 && (
                      <span className="flex items-center ml-2">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {session.rating}
                      </span>
                    )}
                  </div>
                  {session.feedback && (
                    <div className="text-sm text-gray-500">
                      Feedback: {session.feedback}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
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
        {/* Consulting */}
        <TabsContent value="consulting" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockConsulting.map((session) => (
              <Card
                key={session.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session.clientAvatar} />
                      <AvatarFallback>
                        {session.clientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{session.topic}</h3>
                      <p className="text-gray-600 text-sm">
                        Consultant: {session.consultantName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Client: {session.clientName}
                      </p>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(session.date).toLocaleString()}</span>
                  </div>
                  {session.feedback && (
                    <div className="text-sm text-gray-500">
                      Feedback: {session.feedback}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
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
        {/* Bookings */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockBookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={booking.bookedByAvatar} />
                      <AvatarFallback>
                        {booking.bookedBy
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{booking.title}</h3>
                      <p className="text-gray-600 text-sm">{booking.type}</p>
                      <p className="text-gray-500 text-xs">
                        By: {booking.bookedBy}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(booking.date).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">{booking.notes}</div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
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
      </Tabs>
    </div>
  );
}
