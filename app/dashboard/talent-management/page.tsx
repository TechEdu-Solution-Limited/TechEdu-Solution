"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  Share2,
  ArrowUp,
  ArrowDown,
  Star,
  Award,
  Trophy,
  Medal,
  GraduationCap,
  BookOpen,
  School,
  Building2,
  Globe,
  MapPin,
  DollarSign,
  Briefcase,
  Brain,
  Rocket,
  Zap,
  Activity,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search,
  Plus,
  MessageCircle,
  Phone,
  Mail,
  Linkedin,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Code,
  Database,
  Cloud,
  Shield,
  Layers,
  Settings,
  Bell,
  CheckCircle2,
  XCircle as XCircleIcon,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  CalendarDays,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface TalentMetrics {
  totalTalent: number;
  activeTalent: number;
  placedTalent: number;
  placementRate: number;
  averagePlacementTime: number;
  totalRevenue: number;
  revenueGrowth: number;
  clientSatisfaction: number;
  retentionRate: number;
  newTalentThisMonth: number;
  interviewsThisMonth: number;
  offersThisMonth: number;
}

interface Talent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  experience: number;
  location: string;
  status: "available" | "placed" | "interviewing" | "offered" | "inactive";
  rating: number;
  skills: string[];
  education: string;
  certifications: string[];
  availability: string;
  expectedSalary: number;
  joinDate: string;
  lastActive: string;
  interviews: number;
  offers: number;
  placements: number;
  totalEarnings: number;
  clientFeedback: string;
  notes: string;
}

interface TalentPipeline {
  id: string;
  name: string;
  stage: "sourcing" | "screening" | "interviewing" | "offered" | "placed";
  count: number;
  conversionRate: number;
  averageTime: number;
  status: "active" | "paused" | "completed";
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  avatar: string;
  requirements: string[];
  budget: number;
  timeline: string;
  status: "active" | "completed" | "paused";
  placedTalent: number;
  satisfaction: number;
  totalSpent: number;
}

interface Placement {
  id: string;
  talentName: string;
  talentAvatar: string;
  clientName: string;
  clientCompany: string;
  position: string;
  startDate: string;
  endDate: string;
  salary: number;
  commission: number;
  status: "active" | "completed" | "terminated";
  performance: number;
  clientFeedback: string;
}

export default function TalentManagementPage() {
  const { userData } = useRole();
  const [metrics, setMetrics] = useState<TalentMetrics | null>(null);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [pipelines, setPipelines] = useState<TalentPipeline[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMetrics: TalentMetrics = {
      totalTalent: 2847,
      activeTalent: 2156,
      placedTalent: 891,
      placementRate: 31.3,
      averagePlacementTime: 45.2,
      totalRevenue: 28500000,
      revenueGrowth: 18.5,
      clientSatisfaction: 94.2,
      retentionRate: 87.6,
      newTalentThisMonth: 156,
      interviewsThisMonth: 89,
      offersThisMonth: 34,
    };

    const mockTalents: Talent[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        avatar: "/avatars/sarah.jpg",
        specialization: "Senior Software Engineer",
        experience: 8,
        location: "San Francisco, CA",
        status: "available",
        rating: 4.8,
        skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
        education: "MS Computer Science, Stanford University",
        certifications: [
          "AWS Certified Developer",
          "Google Cloud Professional",
        ],
        availability: "Immediate",
        expectedSalary: 150000,
        joinDate: "2023-05-15",
        lastActive: "2 hours ago",
        interviews: 12,
        offers: 3,
        placements: 2,
        totalEarnings: 280000,
        clientFeedback: "Excellent technical skills and communication",
        notes: "Strong React developer, great team player",
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike.chen@email.com",
        avatar: "/avatars/mike.jpg",
        specialization: "Full Stack Developer",
        experience: 5,
        location: "New York, NY",
        status: "interviewing",
        rating: 4.6,
        skills: ["JavaScript", "Python", "Angular", "PostgreSQL", "Redis"],
        education: "BS Computer Science, MIT",
        certifications: ["MongoDB Certified Developer"],
        availability: "2 weeks notice",
        expectedSalary: 120000,
        joinDate: "2023-02-20",
        lastActive: "1 day ago",
        interviews: 8,
        offers: 2,
        placements: 1,
        totalEarnings: 180000,
        clientFeedback: "Solid developer, good problem-solving skills",
        notes: "Currently interviewing with TechCorp",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        avatar: "/avatars/emily.jpg",
        specialization: "UI/UX Designer",
        experience: 6,
        location: "Austin, TX",
        status: "placed",
        rating: 4.9,
        skills: ["Figma", "Adobe XD", "HTML", "CSS", "JavaScript"],
        education: "BFA Design, Parsons School of Design",
        certifications: ["Google UX Design Certificate"],
        availability: "Not available",
        expectedSalary: 110000,
        joinDate: "2023-10-10",
        lastActive: "1 week ago",
        interviews: 15,
        offers: 4,
        placements: 3,
        totalEarnings: 320000,
        clientFeedback: "Outstanding design skills and user empathy",
        notes: "Currently placed at DesignStudio Inc",
      },
      {
        id: "4",
        name: "David Kim",
        email: "david.kim@email.com",
        avatar: "/avatars/david.jpg",
        specialization: "DevOps Engineer",
        experience: 7,
        location: "Seattle, WA",
        status: "offered",
        rating: 4.7,
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
        education: "MS Information Technology, Carnegie Mellon",
        certifications: [
          "AWS Certified DevOps Engineer",
          "Kubernetes Administrator",
        ],
        availability: "1 month notice",
        expectedSalary: 140000,
        joinDate: "2023-05-01",
        lastActive: "3 hours ago",
        interviews: 10,
        offers: 2,
        placements: 1,
        totalEarnings: 200000,
        clientFeedback: "Excellent infrastructure knowledge",
        notes: "Offer pending from CloudTech Solutions",
      },
      {
        id: "5",
        name: "Lisa Wang",
        email: "lisa.wang@email.com",
        avatar: "/avatars/lisa.jpg",
        specialization: "Data Scientist",
        experience: 4,
        location: "Boston, MA",
        status: "available",
        rating: 4.5,
        skills: ["Python", "R", "Machine Learning", "TensorFlow"],
        education: "PhD Statistics, Harvard University",
        certifications: ["Google Data Analytics Certificate"],
        availability: "Immediate",
        expectedSalary: 130000,
        joinDate: "2023-12-01",
        lastActive: "5 hours ago",
        interviews: 6,
        offers: 1,
        placements: 0,
        totalEarnings: 0,
        clientFeedback: "Strong analytical skills",
        notes: "Recent PhD graduate, eager to start",
      },
    ];

    const mockPipelines: TalentPipeline[] = [
      {
        id: "1",
        name: "Software Engineering",
        stage: "sourcing",
        count: 45,
        conversionRate: 85.2,
        averageTime: 12.3,
        status: "active",
      },
      {
        id: "2",
        name: "Data Science",
        stage: "screening",
        count: 23,
        conversionRate: 78.9,
        averageTime: 8.7,
        status: "active",
      },
      {
        id: "3",
        name: "UI/UX Design",
        stage: "interviewing",
        count: 18,
        conversionRate: 92.1,
        averageTime: 15.4,
        status: "active",
      },
      {
        id: "4",
        name: "DevOps",
        stage: "offered",
        count: 8,
        conversionRate: 95.5,
        averageTime: 22.1,
        status: "active",
      },
      {
        id: "5",
        name: "Product Management",
        stage: "placed",
        count: 12,
        conversionRate: 88.3,
        averageTime: 28.5,
        status: "completed",
      },
    ];

    const mockClients: Client[] = [
      {
        id: "1",
        name: "John Smith",
        company: "TechCorp Inc",
        email: "john.smith@techcorp.com",
        avatar: "/avatars/john.jpg",
        requirements: ["React,Node.js", "AWS", "5+ years experience"],
        budget: 150000,
        timeline: "2 weeks",
        status: "active",
        placedTalent: 3,
        satisfaction: 48,
        totalSpent: 45000,
      },
      {
        id: "2",
        name: "Maria Garcia",
        company: "DesignStudio Inc",
        email: "maria.garcia@designstudio.com",
        avatar: "/avatars/maria.jpg",
        requirements: ["Figma", "Adobe XD", "UI/UX + 5 years experience"],
        budget: 110000,
        timeline: "1 month",
        status: "active",
        placedTalent: 2,
        satisfaction: 49,
        totalSpent: 22000,
      },
      {
        id: "3",
        name: "Alex Thompson",
        company: "CloudTech Solutions",
        email: "alex.thompson@cloudtech.com",
        avatar: "/avatars/alex.jpg",
        requirements: ["Docker,Kubernetes", "AWS DevOps"],
        budget: 140000,
        timeline: "3 weeks",
        status: "active",
        placedTalent: 1,
        satisfaction: 47,
        totalSpent: 14000,
      },
    ];

    const mockPlacements: Placement[] = [
      {
        id: "1",
        talentName: "Emily Rodriguez",
        talentAvatar: "/avatars/emily.jpg",
        clientName: "Maria Garcia",
        clientCompany: "DesignStudio Inc",
        position: "Senior UI/UX Designer",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        salary: 110000,
        commission: 11000,
        status: "active",
        performance: 95,
        clientFeedback: "Excellent work quality and communication",
      },
      {
        id: "2",
        talentName: "Sarah Johnson",
        talentAvatar: "/avatars/sarah.jpg",
        clientName: "John Smith",
        clientCompany: "TechCorp Inc",
        position: "Senior Software Engineer",
        startDate: "2023-01-01",
        endDate: "2024-12-31",
        salary: 150000,
        commission: 15000,
        status: "active",
        performance: 92,
        clientFeedback: "Great technical skills and team collaboration",
      },
      {
        id: "3",
        talentName: "Mike Chen",
        talentAvatar: "/avatars/mike.jpg",
        clientName: "John Smith",
        clientCompany: "TechCorp Inc",
        position: "Full Stack Developer",
        startDate: "2023-01-01",
        endDate: "2024-12-31",
        salary: 120000,
        commission: 12000,
        status: "active",
        performance: 88,
        clientFeedback: "Solid developer, meets expectations",
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setTalents(mockTalents);
      setPipelines(mockPipelines);
      setClients(mockClients);
      setPlacements(mockPlacements);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "placed":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-yellow-100 text-yellow-800";
      case "offered":
        return "bg-purple-100 text-purple-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPipelineStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlacementStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1 animate-pulse"></div>
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

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Data not available</h3>
        <p className="text-gray-600">
          Please contact your administrator for access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Talent Management</h1>
          <p className="text-gray-600 mt-2">
            Manage talent pipeline, track placements, and monitor client
            relationships
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Talent
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Talent
                </p>
                <p className="text-2xl font-bold">
                  {metrics.totalTalent.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    +{metrics.newTalentThisMonth} this month
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Placement Rate
                </p>
                <p className="text-2xl font-bold">{metrics.placementRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    +{metrics.revenueGrowth}% growth
                  </span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  ${(metrics.totalRevenue / 100000).toFixed(1)}M
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    +{metrics.revenueGrowth}% growth
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Client Satisfaction
                </p>
                <p className="text-2xl font-bold">
                  {metrics.clientSatisfaction}%
                </p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.retentionRate}% retention
                  </span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="talents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="talents">Talent Pool</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="talents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {talents.map((talent) => (
              <Card
                key={talent.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={talent.avatar} />
                          <AvatarFallback>
                            {talent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {talent.name}
                          </h3>
                          <p className="text-gray-600">
                            {talent.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(talent.status)}>
                          {talent.status}
                        </Badge>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium ml-1">
                            {talent.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 font-medium">
                          {talent.experience} years
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">
                          {talent.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected Salary:</span>
                        <span className="ml-2 font-medium">
                          ${talent.expectedSalary.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Availability:</span>
                        <span className="ml-2 font-medium">
                          {talent.availability}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {talent.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {talent.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{talent.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3">
                      <div className="text-center">
                        <div className="font-medium">{talent.interviews}</div>
                        <div className="text-gray-600">Interviews</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{talent.offers}</div>
                        <div className="text-gray-600">Offers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{talent.placements}</div>
                        <div className="text-gray-600">Placements</div>
                      </div>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pipelines.map((pipeline) => (
              <Card
                key={pipeline.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {pipeline.name}
                        </h3>
                        <p className="text-gray-600 capitalize">
                          {pipeline.stage}
                        </p>
                      </div>
                      <Badge
                        className={getPipelineStatusColor(pipeline.status)}
                      >
                        {pipeline.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Candidates:</span>
                        <span className="ml-2 font-medium">
                          {pipeline.count}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversion:</span>
                        <span className="ml-2 font-medium">
                          {pipeline.conversionRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Time:</span>
                        <span className="ml-2 font-medium">
                          {pipeline.averageTime} days
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span>{pipeline.conversionRate}%</span>
                      </div>
                      <Progress
                        value={pipeline.conversionRate}
                        className="h-2"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Candidates
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clients.map((client) => (
              <Card
                key={client.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {client.name}
                          </h3>
                          <p className="text-gray-600">{client.company}</p>
                        </div>
                      </div>
                      <Badge className={getClientStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="ml-2 font-medium">
                          ${client.budget.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Timeline:</span>
                        <span className="ml-2 font-medium">
                          {client.timeline}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Placed Talent:</span>
                        <span className="ml-2 font-medium">
                          {client.placedTalent}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Satisfaction:</span>
                        <span className="ml-2 font-medium">
                          {client.satisfaction}/5
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {client.requirements.slice(0, 3).map((req) => (
                        <Badge
                          key={req}
                          variant="secondary"
                          className="text-xs"
                        >
                          {req}
                        </Badge>
                      ))}
                      {client.requirements.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{client.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>

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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="placements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {placements.map((placement) => (
              <Card
                key={placement.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={placement.talentAvatar} />
                          <AvatarFallback>
                            {placement.talentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {placement.talentName}
                          </h3>
                          <p className="text-gray-600">{placement.position}</p>
                        </div>
                      </div>
                      <Badge
                        className={getPlacementStatusColor(placement.status)}
                      >
                        {placement.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Client:</span>
                        <span className="ml-2 font-medium">
                          {placement.clientCompany}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Salary:</span>
                        <span className="ml-2 font-medium">
                          ${placement.salary.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Commission:</span>
                        <span className="ml-2 font-medium">
                          ${placement.commission.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Performance:</span>
                        <span className="ml-2 font-medium">
                          {placement.performance}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Performance</span>
                        <span>{placement.performance}%</span>
                      </div>
                      <Progress value={placement.performance} className="h-2" />
                    </div>

                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Client Feedback:</p>
                      <p className="mt-1">{placement.clientFeedback}</p>
                    </div>

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
