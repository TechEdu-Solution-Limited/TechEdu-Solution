"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MessageCircle,
  Calendar,
  Star,
  MapPin,
  Building,
  GraduationCap,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Video,
  Phone,
  Mail,
  Linkedin,
  ExternalLink,
  Award,
  TrendingUp,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  expertise: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  currency: string;
  availability: "available" | "limited" | "unavailable";
  languages: string[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications: string[];
  bio: string;
  achievements: string[];
  mentorshipAreas: string[];
  sessionTypes: ("video" | "phone" | "in-person" | "chat")[];
  responseTime: string; // e.g., "2-4 hours"
  status: "active" | "inactive" | "verified";
  isMyMentor: boolean;
  nextSession?: string;
  totalSessions?: number;
  lastSession?: string;
}

interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: "video" | "phone" | "in-person" | "chat";
  status: "scheduled" | "completed" | "cancelled";
  topic: string;
  notes?: string;
  rating?: number;
  feedback?: string;
}

export default function MentorsPage() {
  const { userData } = useRole();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("all");
  const [showMyMentorsOnly, setShowMyMentorsOnly] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMentors: Mentor[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        avatar: "/assets/team/Dr-Godbless-Akaighe.png",
        title: "Senior Software Engineer",
        company: "Google",
        location: "San Francisco, CA",
        industry: "Technology",
        expertise: [
          "Software Engineering",
          "Machine Learning",
          "Career Development",
        ],
        experience: 8,
        rating: 4.9,
        reviewCount: 127,
        hourlyRate: 150,
        currency: "USD",
        availability: "available",
        languages: ["English", "Spanish"],
        education: [
          {
            degree: "PhD Computer Science",
            institution: "Stanford University",
            year: 2018,
          },
          { degree: "MS Computer Science", institution: "MIT", year: 2015 },
        ],
        certifications: [
          "AWS Solutions Architect",
          "Google Cloud Professional",
        ],
        bio: "Experienced software engineer with expertise in machine learning and distributed systems. Passionate about mentoring students and helping them navigate their tech careers.",
        achievements: [
          "Led 10+ successful ML projects",
          "Mentored 50+ students",
          "Published 15+ research papers",
        ],
        mentorshipAreas: [
          "Career Planning",
          "Technical Skills",
          "Interview Preparation",
        ],
        sessionTypes: ["video", "phone", "chat"],
        responseTime: "2-4 hours",
        status: "verified",
        isMyMentor: true,
        nextSession: "2024-01-25T14:00:00Z",
        totalSessions: 12,
        lastSession: "2024-01-18T10:00:00Z",
      },
      {
        id: "2",
        name: "Michael Chen",
        avatar: "/assets/team/developer.avif",
        title: "Product Manager",
        company: "Microsoft",
        location: "Seattle, WA",
        industry: "Technology",
        expertise: [
          "Product Management",
          "User Experience",
          "Business Strategy",
        ],
        experience: 6,
        rating: 4.8,
        reviewCount: 89,
        hourlyRate: 120,
        currency: "USD",
        availability: "limited",
        languages: ["English", "Mandarin"],
        education: [
          { degree: "MBA", institution: "Harvard Business School", year: 2020 },
          {
            degree: "BS Computer Science",
            institution: "UC Berkeley",
            year: 2018,
          },
        ],
        certifications: ["Certified Scrum Master", "PMP"],
        bio: "Product manager with experience in consumer and enterprise software. Specializes in helping students understand product development and career transitions.",
        achievements: [
          "Launched 5 successful products",
          "Increased user engagement by 300%",
          "Led cross-functional teams of 20+",
        ],
        mentorshipAreas: [
          "Product Management",
          "Career Transition",
          "Leadership",
        ],
        sessionTypes: ["video", "phone"],
        responseTime: "4-6 hours",
        status: "verified",
        isMyMentor: false,
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        title: "Data Scientist",
        company: "Netflix",
        location: "Los Angeles, CA",
        industry: "Technology",
        expertise: ["Data Science", "Python", "Statistics", "A/B Testing"],
        experience: 5,
        rating: 4.7,
        reviewCount: 156,
        hourlyRate: 100,
        currency: "USD",
        availability: "available",
        languages: ["English", "Spanish"],
        education: [
          {
            degree: "MS Data Science",
            institution: "Columbia University",
            year: 2019,
          },
          { degree: "BS Mathematics", institution: "UCLA", year: 2017 },
        ],
        certifications: ["Google Data Analytics", "AWS Machine Learning"],
        bio: "Data scientist passionate about making data accessible and helping students develop analytical skills. Experienced in recommendation systems and user behavior analysis.",
        achievements: [
          "Improved recommendation accuracy by 25%",
          "Mentored 30+ data science students",
          "Presented at 5 conferences",
        ],
        mentorshipAreas: [
          "Data Science Skills",
          "Portfolio Building",
          "Technical Interviews",
        ],
        sessionTypes: ["video", "chat"],
        responseTime: "1-2 hours",
        status: "verified",
        isMyMentor: true,
        totalSessions: 8,
        lastSession: "2024-01-20T16:00:00Z",
      },
      {
        id: "4",
        name: "David Kim",
        avatar: "/assets/team/Maria.webp",
        title: "UX/UI Designer",
        company: "Apple",
        location: "Cupertino, CA",
        industry: "Design",
        expertise: ["UX Design", "UI Design", "User Research", "Prototyping"],
        experience: 7,
        rating: 4.6,
        reviewCount: 73,
        hourlyRate: 110,
        currency: "USD",
        availability: "available",
        languages: ["English", "Korean"],
        education: [
          {
            degree: "MFA Design",
            institution: "Parsons School of Design",
            year: 2017,
          },
          { degree: "BS Psychology", institution: "UC Davis", year: 2015 },
        ],
        certifications: ["Google UX Design", "Adobe Creative Suite"],
        bio: "Senior UX designer with experience in consumer electronics and mobile applications. Dedicated to helping students build strong design portfolios and skills.",
        achievements: [
          "Designed 3 award-winning apps",
          "Led design for 10M+ user product",
          "Mentored 25+ design students",
        ],
        mentorshipAreas: [
          "Portfolio Review",
          "Design Skills",
          "Industry Insights",
        ],
        sessionTypes: ["video", "in-person"],
        responseTime: "3-5 hours",
        status: "verified",
        isMyMentor: false,
      },
      {
        id: "5",
        name: "Lisa Thompson",
        title: "Startup Founder & CEO",
        company: "TechStart Inc.",
        location: "Austin, TX",
        industry: "Entrepreneurship",
        expertise: [
          "Startup Strategy",
          "Fundraising",
          "Business Development",
          "Leadership",
        ],
        experience: 10,
        rating: 4.9,
        reviewCount: 45,
        hourlyRate: 200,
        currency: "USD",
        availability: "limited",
        languages: ["English"],
        education: [
          {
            degree: "MBA",
            institution: "Stanford Graduate School of Business",
            year: 2014,
          },
          { degree: "BS Engineering", institution: "MIT", year: 2012 },
        ],
        certifications: ["Lean Startup", "Design Thinking"],
        bio: "Serial entrepreneur who has founded and scaled multiple successful startups. Passionate about helping students understand entrepreneurship and business development.",
        achievements: [
          "Founded 3 successful startups",
          "Raised $50M+ in funding",
          "Exited 2 companies",
        ],
        mentorshipAreas: [
          "Entrepreneurship",
          "Business Strategy",
          "Leadership",
        ],
        sessionTypes: ["video", "phone"],
        responseTime: "6-8 hours",
        status: "verified",
        isMyMentor: false,
      },
    ];

    const mockSessions: MentorshipSession[] = [
      {
        id: "s1",
        mentorId: "1",
        mentorName: "Dr. Sarah Johnson",
        date: "2024-01-25",
        time: "14:00",
        duration: 60,
        type: "video",
        status: "scheduled",
        topic: "Machine Learning Career Path Discussion",
      },
      {
        id: "s2",
        mentorId: "1",
        mentorName: "Dr. Sarah Johnson",
        date: "2024-01-18",
        time: "10:00",
        duration: 45,
        type: "video",
        status: "completed",
        topic: "Resume Review and Interview Preparation",
        rating: 5,
        feedback:
          "Excellent session! Sarah provided great insights on my resume and interview techniques.",
      },
      {
        id: "s3",
        mentorId: "3",
        mentorName: "Emily Rodriguez",
        date: "2024-01-20",
        time: "16:00",
        duration: 60,
        type: "video",
        status: "completed",
        topic: "Data Science Project Portfolio Review",
        rating: 4,
        feedback:
          "Very helpful feedback on my portfolio projects and next steps.",
      },
    ];

    setTimeout(() => {
      setMentors(mockMentors);
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some((exp) =>
        exp.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry =
      selectedIndustry === "all" || mentor.industry === selectedIndustry;
    const matchesExpertise =
      selectedExpertise === "all" ||
      mentor.expertise.includes(selectedExpertise);
    const matchesMyMentors = !showMyMentorsOnly || mentor.isMyMentor;

    return (
      matchesSearch && matchesIndustry && matchesExpertise && matchesMyMentors
    );
  });

  const myMentors = mentors.filter((mentor) => mentor.isMyMentor);
  const upcomingSessions = sessions.filter(
    (session) => session.status === "scheduled"
  );
  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  );
  const totalSpent = completedSessions.length * 100; // Assuming average session cost

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
          <h1 className="text-3xl font-bold">Mentors</h1>
          <p className="text-gray-600 mt-2">
            Connect with industry professionals and academic mentors
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Find New Mentor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Mentors</p>
                <p className="text-2xl font-bold">{myMentors.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Sessions
                </p>
                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
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
                placeholder="Search mentors by name, expertise, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
              </select>

              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Expertise</option>
                <option value="Software Engineering">
                  Software Engineering
                </option>
                <option value="Data Science">Data Science</option>
                <option value="Product Management">Product Management</option>
                <option value="UX Design">UX Design</option>
                <option value="Career Development">Career Development</option>
              </select>

              <Button
                variant={showMyMentorsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMyMentorsOnly(!showMyMentorsOnly)}
              >
                My Mentors Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Mentors ({filteredMentors.length})
          </TabsTrigger>
          <TabsTrigger value="my-mentors">
            My Mentors ({myMentors.length})
          </TabsTrigger>
          <TabsTrigger value="sessions">
            Sessions ({sessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-mentors" className="space-y-6">
          {myMentors.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No mentors yet</h3>
                <p className="text-gray-600 mb-4">
                  Start connecting with mentors to accelerate your learning and
                  career growth.
                </p>
                <Button>Find Your First Mentor</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No sessions scheduled
                  </h3>
                  <p className="text-gray-600">
                    Book your first mentorship session to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src={mentor.avatar} />
                <AvatarFallback className="text-lg">
                  {mentor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{mentor.name}</h3>
                <p className="text-gray-600">{mentor.title}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <Building className="w-4 h-4" />
                  <span>{mentor.company}</span>
                  <span>•</span>
                  <MapPin className="w-4 h-4" />
                  <span>{mentor.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getAvailabilityColor(mentor.availability)}>
                {mentor.availability}
              </Badge>
              <Badge className={getStatusColor(mentor.status)}>
                {mentor.status}
              </Badge>
            </div>
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-medium">{mentor.rating}</span>
              </div>
              <span className="text-gray-500">
                ({mentor.reviewCount} reviews)
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${mentor.hourlyRate}/{mentor.currency}
              </p>
              <p className="text-sm text-gray-500">
                {mentor.experience} years exp.
              </p>
            </div>
          </div>

          {/* Expertise */}
          <div>
            <p className="text-sm font-medium mb-2">Expertise:</p>
            <div className="flex flex-wrap gap-1">
              {mentor.expertise.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {mentor.expertise.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{mentor.expertise.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm line-clamp-2">{mentor.bio}</p>

          {/* Session Types */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Session types:</span>
            {mentor.sessionTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            {mentor.isMyMentor ? (
              <>
                <Button size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </>
            )}
          </div>

          {/* My Mentor Stats */}
          {mentor.isMyMentor && (
            <div className="bg-blue-50 p-3 rounded-[10px]">
              <div className="flex items-center justify-between text-sm">
                <span>Total sessions: {mentor.totalSessions}</span>
                {mentor.nextSession && (
                  <span>
                    Next: {new Date(mentor.nextSession).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SessionCard({ session }: { session: MentorshipSession }) {
  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "phone":
        return Phone;
      case "in-person":
        return User;
      case "chat":
        return MessageCircle;
      default:
        return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SessionTypeIcon = getSessionTypeIcon(session.type);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-[10px]">
              <SessionTypeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{session.topic}</h3>
              <p className="text-sm text-gray-600">with {session.mentorName}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>{new Date(session.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{session.time}</span>
                <span>•</span>
                <span>{session.duration} min</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(session.status)}>
              {session.status}
            </Badge>
            {session.rating && (
              <div className="flex items-center text-sm">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                {session.rating}
              </div>
            )}
          </div>
        </div>

        {session.feedback && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">{session.feedback}</p>
          </div>
        )}

        <div className="flex space-x-2 mt-4">
          {session.status === "scheduled" && (
            <>
              <Button size="sm" variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Join Session
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            </>
          )}
          {session.status === "completed" && !session.rating && (
            <Button size="sm" variant="outline">
              <Star className="w-4 h-4 mr-2" />
              Rate Session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
