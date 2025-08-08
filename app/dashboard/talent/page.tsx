"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  MessageCircle,
  Users,
  RefreshCw,
  Star,
  Target,
  DollarSign,
  BookOpen,
  Briefcase,
} from "lucide-react";

// Talent Pool & Uploaded Professionals
interface Talent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  experience: number;
  location: string;
  status:
    | "available"
    | "placed"
    | "interviewing"
    | "offered"
    | "inactive"
    | "pending"
    | "rejected";
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
  uploadedAt?: string;
}

// Pipeline
interface TalentPipeline {
  id: string;
  name: string;
  stage: "sourcing" | "screening" | "interviewing" | "offered" | "placed";
  count: number;
  conversionRate: number;
  averageTime: number;
  status: "active" | "paused" | "completed";
}

// Clients
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

// Placements
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
    certifications: ["AWS Certified Developer", "Google Cloud Professional"],
    availability: "Immediate",
    expectedSalary: 150000,
    joinDate: "2023-01-15",
    lastActive: "2 hours ago",
    interviews: 12,
    offers: 3,
    placements: 2,
    totalEarnings: 28000,
    clientFeedback: "Excellent technical skills and communication",
    notes: "Strong React developer, great team player",
    uploadedAt: "2024-06-01",
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
    skills: ["JavaScript", "Python", "Django", "PostgreSQL", "Redis"],
    education: "BS Computer Science, MIT",
    certifications: ["MongoDB Certified Developer"],
    availability: "2 weeks notice",
    expectedSalary: 120000,
    joinDate: "2023-02-20",
    lastActive: "1 day ago",
    interviews: 8,
    offers: 2,
    placements: 1,
    totalEarnings: 18000,
    clientFeedback: "Solid developer, good problem-solving skills",
    notes: "Currently interviewing with TechCorp",
    uploadedAt: "2024-06-02",
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
    joinDate: "2023-03-10",
    lastActive: "1 week ago",
    interviews: 15,
    offers: 4,
    placements: 3,
    totalEarnings: 32000,
    clientFeedback: "Outstanding design skills and user empathy",
    notes: "Currently placed at DesignStudio Inc",
    uploadedAt: "2024-06-03",
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
    company: "TechCorp Inc.",
    email: "john.smith@techcorp.com",
    avatar: "/avatars/john.jpg",
    requirements: ["React", "Node.js", "AWS", "5+ years experience"],
    budget: 150000,
    timeline: "2 weeks",
    status: "active",
    placedTalent: 3,
    satisfaction: 4.8,
    totalSpent: 45000,
  },
  {
    id: "2",
    name: "Maria Garcia",
    company: "DesignStudio Inc.",
    email: "maria.garcia@designstudio.com",
    avatar: "/avatars/maria.jpg",
    requirements: ["Figma", "Adobe XD", "UI/UX", "3+ years experience"],
    budget: 110000,
    timeline: "1 month",
    status: "active",
    placedTalent: 2,
    satisfaction: 4.9,
    totalSpent: 22000,
  },
  {
    id: "3",
    name: "Alex Thompson",
    company: "CloudTech Solutions",
    email: "alex.thompson@cloudtech.com",
    avatar: "/avatars/alex.jpg",
    requirements: ["Docker", "Kubernetes", "AWS", "DevOps"],
    budget: 140000,
    timeline: "3 weeks",
    status: "active",
    placedTalent: 1,
    satisfaction: 4.7,
    totalSpent: 14000,
  },
];

const mockPlacements: Placement[] = [
  {
    id: "1",
    talentName: "Emily Rodriguez",
    talentAvatar: "/avatars/emily.jpg",
    clientName: "Maria Garcia",
    clientCompany: "DesignStudio Inc.",
    position: "Senior UI/UX Designer",
    startDate: "2024-01-01",
    endDate: "2024-04-01",
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
    clientCompany: "TechCorp Inc.",
    position: "Senior Software Engineer",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
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
    clientCompany: "TechCorp Inc.",
    position: "Full Stack Developer",
    startDate: "2023-09-01",
    endDate: "2024-04-01",
    salary: 120000,
    commission: 12000,
    status: "active",
    performance: 88,
    clientFeedback: "Solid developer, meets expectations",
  },
];

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
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "terminated":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TalentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Talent Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all talent, pipeline, clients, and placements in one place.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="pool" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pool">Talent Pool</TabsTrigger>
          <TabsTrigger value="uploaded">Uploaded Professionals</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
        </TabsList>
        {/* Talent Pool */}
        <TabsContent value="pool" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTalents.map((talent) => (
              <Card
                key={talent.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
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
                        <h3 className="font-semibold text-lg">{talent.name}</h3>
                        <p className="text-gray-600">{talent.specialization}</p>
                        <p className="text-gray-500 text-xs">{talent.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(talent.status)}>
                      {talent.status}
                    </Badge>
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
                  <div className="grid grid-cols-3 text-center text-xs text-gray-500">
                    <div>
                      <div className="font-medium">{talent.experience} yrs</div>
                      <div>Experience</div>
                    </div>
                    <div>
                      <div className="font-medium">{talent.interviews}</div>
                      <div>Interviews</div>
                    </div>
                    <div>
                      <div className="font-medium">{talent.placements}</div>
                      <div>Placements</div>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* Uploaded Professionals */}
        <TabsContent value="uploaded" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTalents.map((pro) => (
              <Card key={pro.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={pro.avatar} />
                      <AvatarFallback>
                        {pro.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{pro.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {pro.specialization}
                      </p>
                      <p className="text-gray-500 text-xs">{pro.email}</p>
                    </div>
                    <Badge className={getStatusColor(pro.status)}>
                      {pro.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>
                      Uploaded:{" "}
                      {pro.uploadedAt
                        ? new Date(pro.uploadedAt).toLocaleDateString()
                        : "-"}
                    </span>
                    <span className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {pro.rating}
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
        {/* Pipeline */}
        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPipelines.map((pipeline) => (
              <Card
                key={pipeline.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{pipeline.name}</h3>
                      <p className="text-gray-600 capitalize">
                        {pipeline.stage}
                      </p>
                    </div>
                    <Badge className={getStatusColor(pipeline.status)}>
                      {pipeline.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Candidates:</span>
                      <span className="ml-2 font-medium">{pipeline.count}</span>
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
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${pipeline.conversionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Users className="w-4 h-4 mr-2" />
                      View Candidates
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* Clients */}
        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockClients.map((client) => (
              <Card
                key={client.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
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
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <p className="text-gray-600 text-sm">{client.company}</p>
                      <p className="text-gray-500 text-xs">{client.email}</p>
                    </div>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {client.requirements.slice(0, 3).map((req) => (
                      <Badge key={req} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                    {client.requirements.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{client.requirements.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <span>Budget:</span>{" "}
                      <span className="ml-1 font-medium">
                        ${client.budget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span>Timeline:</span>{" "}
                      <span className="ml-1 font-medium">
                        {client.timeline}
                      </span>
                    </div>
                    <div>
                      <span>Placed Talent:</span>{" "}
                      <span className="ml-1 font-medium">
                        {client.placedTalent}
                      </span>
                    </div>
                    <div>
                      <span>Satisfaction:</span>{" "}
                      <span className="ml-1 font-medium">
                        {client.satisfaction}/5
                      </span>
                    </div>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* Placements */}
        <TabsContent value="placements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPlacements.map((placement) => (
              <Card
                key={placement.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
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
                      <p className="text-gray-600 text-sm">
                        {placement.position}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {placement.clientCompany}
                      </p>
                    </div>
                    <Badge className={getStatusColor(placement.status)}>
                      {placement.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <span>Salary:</span>{" "}
                      <span className="ml-1 font-medium">
                        ${placement.salary.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span>Commission:</span>{" "}
                      <span className="ml-1 font-medium">
                        ${placement.commission.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span>Performance:</span>{" "}
                      <span className="ml-1 font-medium">
                        {placement.performance}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance</span>
                      <span>{placement.performance}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${placement.performance}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
