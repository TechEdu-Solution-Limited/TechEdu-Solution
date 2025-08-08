"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  MessageCircle,
  Calendar,
  User,
  BookOpen,
  Award,
  AlertTriangle,
  Info,
  Star,
  Filter,
  Search,
  Eye,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "general" | "academic" | "career" | "event" | "urgent" | "achievement";
  priority: "low" | "medium" | "high";
  author: {
    name: string;
    avatar?: string;
    role: string;
    department?: string;
  };
  publishDate: string;
  expiryDate?: string;
  read: boolean;
  bookmarked: boolean;
  attachments?: string[];
  tags: string[];
  targetAudience: string[];
  actionRequired?: boolean;
  actionDeadline?: string;
}

export default function AnnouncementsPage() {
  const { userData } = useRole();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAnnouncements: Announcement[] = [
      {
        id: "1",
        title: "Spring Semester Registration Deadline Extended",
        content:
          "Due to high demand, we've extended the registration deadline for Spring 2024 courses until January 25th. Please ensure all course selections are finalized by this date. Contact your academic advisor if you need assistance with course planning.",
        type: "academic",
        priority: "high",
        author: {
          name: "Dr. Sarah Johnson",
          avatar: "/assets/team/Dr-Godbless-Akaighe.png",
          role: "Academic Dean",
          department: "Academic Affairs",
        },
        publishDate: "2024-01-15T09:00:00Z",
        expiryDate: "2024-01-25T23:59:59Z",
        read: false,
        bookmarked: true,
        tags: ["registration", "deadline", "spring-semester"],
        targetAudience: ["all-students"],
        actionRequired: true,
        actionDeadline: "2024-01-25",
      },
      {
        id: "2",
        title: "Career Fair: Tech Industry Leaders Coming to Campus",
        content:
          "Join us for our annual Tech Career Fair on February 15th! Top companies including Google, Microsoft, Amazon, and local startups will be recruiting. Prepare your resume and practice your elevator pitch. Registration opens next week.",
        type: "career",
        priority: "medium",
        author: {
          name: "Michael Chen",
          avatar: "/assets/team/developer.avif",
          role: "Career Services Director",
          department: "Career Development",
        },
        publishDate: "2024-01-14T14:30:00Z",
        read: true,
        bookmarked: false,
        tags: ["career-fair", "networking", "job-opportunities"],
        targetAudience: ["all-students"],
        attachments: ["career_fair_schedule.pdf"],
      },
      {
        id: "3",
        title: "Congratulations! Student Achievement Award Winners",
        content:
          "We're proud to announce the winners of this year's Student Achievement Awards. These students have demonstrated exceptional academic performance, leadership, and community service. Join us for the awards ceremony on March 1st.",
        type: "achievement",
        priority: "low",
        author: {
          name: "Emily Rodriguez",
          role: "Student Affairs Coordinator",
          department: "Student Life",
        },
        publishDate: "2024-01-13T16:00:00Z",
        read: true,
        bookmarked: false,
        tags: ["achievement", "awards", "recognition"],
        targetAudience: ["all-students"],
      },
      {
        id: "4",
        title: "URGENT: Campus Network Maintenance Tonight",
        content:
          "Scheduled maintenance will affect campus WiFi and online services tonight from 11 PM to 3 AM. Please save your work and expect intermittent connectivity. All services will be restored by morning.",
        type: "urgent",
        priority: "high",
        author: {
          name: "IT Support Team",
          role: "IT Administrator",
          department: "Information Technology",
        },
        publishDate: "2024-01-15T17:00:00Z",
        read: false,
        bookmarked: false,
        tags: ["maintenance", "wifi", "technical"],
        targetAudience: ["all-students"],
      },
      {
        id: "5",
        title: "New Study Abroad Programs Available",
        content:
          "Explore new study abroad opportunities in Europe and Asia for Fall 2024. Programs include technology internships, cultural immersion, and academic partnerships. Information sessions start next week.",
        type: "general",
        priority: "medium",
        author: {
          name: "Lisa Thompson",
          avatar: "/assets/team/Maria.webp",
          role: "International Programs Coordinator",
          department: "Global Education",
        },
        publishDate: "2024-01-12T10:15:00Z",
        read: true,
        bookmarked: true,
        tags: ["study-abroad", "international", "opportunities"],
        targetAudience: ["undergraduate-students"],
        attachments: ["study_abroad_brochure.pdf", "application_guide.pdf"],
      },
      {
        id: "6",
        title: "Workshop: Resume Writing for Tech Careers",
        content:
          "Learn how to craft a compelling resume for technology careers. This hands-on workshop will cover industry best practices, ATS optimization, and portfolio development. Limited spots available.",
        type: "career",
        priority: "medium",
        author: {
          name: "David Kim",
          role: "Career Counselor",
          department: "Career Development",
        },
        publishDate: "2024-01-11T13:45:00Z",
        read: false,
        bookmarked: false,
        tags: ["workshop", "resume", "career-development"],
        targetAudience: ["all-students"],
        actionRequired: true,
        actionDeadline: "2024-01-20",
      },
      {
        id: "7",
        title: "Library Extended Hours During Finals Week",
        content:
          "The main library will be open 24/7 during finals week (January 22-26). Additional study spaces and quiet zones have been designated. Coffee and snacks will be available in the student lounge.",
        type: "general",
        priority: "low",
        author: {
          name: "Library Services",
          role: "Library Director",
          department: "Library",
        },
        publishDate: "2024-01-10T11:20:00Z",
        read: true,
        bookmarked: false,
        tags: ["library", "finals", "study-spaces"],
        targetAudience: ["all-students"],
      },
      {
        id: "8",
        title: "Student Government Elections: Nominations Open",
        content:
          "Nominations are now open for Student Government positions. Make your voice heard and help shape campus policies. Nomination forms are available online and in the Student Center.",
        type: "event",
        priority: "medium",
        author: {
          name: "Student Government",
          role: "Election Committee Chair",
          department: "Student Government",
        },
        publishDate: "2024-01-09T15:30:00Z",
        read: false,
        bookmarked: false,
        tags: ["elections", "student-government", "leadership"],
        targetAudience: ["all-students"],
        actionRequired: true,
        actionDeadline: "2024-01-30",
      },
    ];

    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "academic":
        return "bg-blue-100 text-blue-800";
      case "career":
        return "bg-green-100 text-green-800";
      case "achievement":
        return "bg-yellow-100 text-yellow-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return AlertTriangle;
      case "academic":
        return BookOpen;
      case "career":
        return User;
      case "achievement":
        return Award;
      case "event":
        return Calendar;
      case "general":
        return Info;
      default:
        return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const markAsRead = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId
          ? { ...announcement, read: true }
          : announcement
      )
    );
  };

  const toggleBookmark = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId
          ? { ...announcement, bookmarked: !announcement.bookmarked }
          : announcement
      )
    );
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType =
      selectedType === "all" || announcement.type === selectedType;
    const matchesPriority =
      selectedPriority === "all" || announcement.priority === selectedPriority;
    const matchesReadStatus = !showUnreadOnly || !announcement.read;

    return matchesSearch && matchesType && matchesPriority && matchesReadStatus;
  });

  const unreadCount = announcements.filter((a) => !a.read).length;
  const bookmarkedCount = announcements.filter((a) => a.bookmarked).length;
  const urgentCount = announcements.filter((a) => a.type === "urgent").length;
  const actionRequiredCount = announcements.filter(
    (a) => a.actionRequired
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest news and important information
          </p>
        </div>
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          Notification Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold">{urgentCount}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-[10px]">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Action Required
                </p>
                <p className="text-2xl font-bold">{actionRequiredCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookmarked</p>
                <p className="text-2xl font-bold">{bookmarkedCount}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="career">Career</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
                <option value="achievement">Achievement</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <Button
                variant={showUnreadOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              >
                Unread Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No announcements found
              </h3>
              <p className="text-gray-600">
                {searchTerm ||
                selectedType !== "all" ||
                selectedPriority !== "all" ||
                showUnreadOnly
                  ? "Try adjusting your search or filter criteria."
                  : "No announcements at the moment. Check back later!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const TypeIcon = getTypeIcon(announcement.type);
            const isExpired =
              announcement.expiryDate &&
              new Date(announcement.expiryDate) < new Date();

            return (
              <Card
                key={announcement.id}
                className={`hover:shadow-md transition-shadow ${
                  !announcement.read ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-[10px] mt-1">
                          <TypeIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3
                              className={`font-semibold text-lg ${
                                !announcement.read ? "text-blue-900" : ""
                              }`}
                            >
                              {announcement.title}
                            </h3>
                            {!announcement.read && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                New
                              </Badge>
                            )}
                            {announcement.actionRequired && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Action Required
                              </Badge>
                            )}
                            {isExpired && (
                              <Badge className="bg-gray-100 text-gray-800 text-xs">
                                Expired
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Avatar className="w-4 h-4 mr-1">
                                <AvatarImage src={announcement.author.avatar} />
                                <AvatarFallback className="text-xs">
                                  {announcement.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{announcement.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>{announcement.author.role}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                announcement.publishDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(announcement.type)}>
                          {announcement.type}
                        </Badge>
                        <Badge
                          className={getPriorityColor(announcement.priority)}
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-gray-700 leading-relaxed">
                      {announcement.content}
                    </div>

                    {/* Tags */}
                    {announcement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {announcement.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Action Required Info */}
                    {announcement.actionRequired &&
                      announcement.actionDeadline && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-3">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">
                              Action Required by{" "}
                              {new Date(
                                announcement.actionDeadline
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Attachments */}
                    {announcement.attachments &&
                      announcement.attachments.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Attachments:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {announcement.attachments.map((attachment) => (
                              <Button
                                key={attachment}
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {attachment}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        {!announcement.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(announcement.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleBookmark(announcement.id)}
                          className={
                            announcement.bookmarked ? "text-blue-600" : ""
                          }
                        >
                          <Bookmark
                            className={`w-4 h-4 mr-2 ${
                              announcement.bookmarked ? "fill-current" : ""
                            }`}
                          />
                          {announcement.bookmarked ? "Bookmarked" : "Bookmark"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
