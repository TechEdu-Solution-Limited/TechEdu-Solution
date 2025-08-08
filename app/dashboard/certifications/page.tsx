"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Award,
  Calendar,
  Clock,
  Star,
  Plus,
  Edit,
  Download,
  Share2,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Zap,
  Building,
  Globe,
  Shield,
  Database,
  Cloud,
  Code,
  Smartphone,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface Certification {
  id: string;
  name: string;
  provider: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  status: "active" | "expired" | "in-progress" | "planned";
  earnedDate?: string;
  expiryDate?: string;
  progress?: number;
  score?: number;
  credentialId?: string;
  verificationUrl?: string;
  cost: number;
  currency: string;
  duration: string;
  skills: string[];
  description: string;
  benefits: string[];
  requirements: string[];
  examDetails?: {
    format: string;
    duration: string;
    questions: number;
    passingScore: number;
  };
}

interface CertificationProvider {
  name: string;
  logo?: string;
  category: string;
  certifications: Certification[];
  reputation: number;
  totalCertifications: number;
}

export default function CertificationsPage() {
  const { userData } = useRole();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [providers, setProviders] = useState<CertificationProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCertifications: Certification[] = [
      {
        id: "1",
        name: "AWS Solutions Architect Associate",
        provider: "Amazon Web Services",
        category: "Cloud & DevOps",
        level: "intermediate",
        status: "active",
        earnedDate: "2023-03-20",
        expiryDate: "2026-03-20",
        score: 875,
        credentialId: "AWS-123456789",
        verificationUrl: "https://aws.amazon.com/verification",
        cost: 150,
        currency: "USD",
        duration: "3 months",
        skills: ["AWS", "Cloud Architecture", "DevOps", "Infrastructure"],
        description:
          "Validate your expertise in designing distributed systems on AWS.",
        benefits: [
          "Higher salary potential",
          "Industry recognition",
          "Career advancement",
          "Technical credibility",
        ],
        requirements: [
          "1+ years of AWS experience",
          "Basic networking knowledge",
          "Understanding of distributed systems",
        ],
        examDetails: {
          format: "Multiple choice",
          duration: "130 minutes",
          questions: 65,
          passingScore: 720,
        },
      },
      {
        id: "2",
        name: "React Developer Certificate",
        provider: "Meta",
        category: "Frontend Development",
        level: "intermediate",
        status: "active",
        earnedDate: "2023-01-15",
        expiryDate: "2025-01-15",
        score: 92,
        credentialId: "META-REACT-987654",
        verificationUrl: "https://meta.com/certificates",
        cost: 100,
        currency: "USD",
        duration: "2 months",
        skills: ["React", "JavaScript", "Frontend Development", "UI/UX"],
        description: "Demonstrate your React development skills and knowledge.",
        benefits: [
          "Frontend expertise validation",
          "React ecosystem knowledge",
          "Modern development practices",
        ],
        requirements: [
          "JavaScript fundamentals",
          "Basic React knowledge",
          "Web development experience",
        ],
      },
      {
        id: "3",
        name: "Kubernetes Administrator",
        provider: "Cloud Native Computing Foundation",
        category: "Cloud & DevOps",
        level: "advanced",
        status: "in-progress",
        progress: 65,
        earnedDate: undefined,
        expiryDate: undefined,
        cost: 300,
        currency: "USD",
        duration: "4 months",
        skills: ["Kubernetes", "Container Orchestration", "DevOps", "Linux"],
        description: "Master Kubernetes administration and cluster management.",
        benefits: [
          "DevOps leadership",
          "Container expertise",
          "Infrastructure management",
        ],
        requirements: [
          "Linux administration",
          "Docker experience",
          "Networking knowledge",
        ],
        examDetails: {
          format: "Hands-on lab",
          duration: "180 minutes",
          questions: 0,
          passingScore: 74,
        },
      },
      {
        id: "4",
        name: "Python Developer Certificate",
        provider: "Python Institute",
        category: "Programming Languages",
        level: "intermediate",
        status: "expired",
        earnedDate: "2022-06-10",
        expiryDate: "2024-06-10",
        score: 88,
        credentialId: "PYTHON-456789",
        verificationUrl: "https://pythoninstitute.org/verify",
        cost: 120,
        currency: "USD",
        duration: "3 months",
        skills: ["Python", "Programming", "Software Development"],
        description: "Validate your Python programming skills and knowledge.",
        benefits: [
          "Programming expertise",
          "Software development skills",
          "Problem-solving abilities",
        ],
        requirements: [
          "Basic programming concepts",
          "Python fundamentals",
          "Algorithm knowledge",
        ],
      },
      {
        id: "5",
        name: "Google Cloud Professional Data Engineer",
        provider: "Google Cloud",
        category: "Data & Analytics",
        level: "advanced",
        status: "planned",
        earnedDate: undefined,
        expiryDate: undefined,
        cost: 200,
        currency: "USD",
        duration: "6 months",
        skills: [
          "Google Cloud",
          "Data Engineering",
          "Big Data",
          "Machine Learning",
        ],
        description:
          "Design and build data processing systems on Google Cloud.",
        benefits: [
          "Data engineering expertise",
          "Cloud data solutions",
          "ML pipeline knowledge",
        ],
        requirements: [
          "Data engineering experience",
          "Google Cloud knowledge",
          "SQL and programming skills",
        ],
        examDetails: {
          format: "Multiple choice",
          duration: "120 minutes",
          questions: 50,
          passingScore: 70,
        },
      },
    ];

    const mockProviders: CertificationProvider[] = [
      {
        name: "Amazon Web Services",
        logo: "/assets/logos/aws.png",
        category: "Cloud & DevOps",
        certifications: mockCertifications.filter(
          (c) => c.provider === "Amazon Web Services"
        ),
        reputation: 4.8,
        totalCertifications: 12,
      },
      {
        name: "Google Cloud",
        logo: "/assets/logos/google-cloud.png",
        category: "Cloud & DevOps",
        certifications: mockCertifications.filter(
          (c) => c.provider === "Google Cloud"
        ),
        reputation: 4.6,
        totalCertifications: 8,
      },
      {
        name: "Meta",
        logo: "/assets/logos/meta.png",
        category: "Frontend Development",
        certifications: mockCertifications.filter((c) => c.provider === "Meta"),
        reputation: 4.4,
        totalCertifications: 5,
      },
    ];

    setTimeout(() => {
      setCertifications(mockCertifications);
      setProviders(mockProviders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cloud & DevOps":
        return Cloud;
      case "Frontend Development":
        return Globe;
      case "Programming Languages":
        return Code;
      case "Data & Analytics":
        return Database;
      case "Cybersecurity":
        return Shield;
      case "Mobile Development":
        return Smartphone;
      default:
        return Award;
    }
  };

  const activeCertifications = certifications.filter(
    (c) => c.status === "active"
  );
  const inProgressCertifications = certifications.filter(
    (c) => c.status === "in-progress"
  );
  const expiredCertifications = certifications.filter(
    (c) => c.status === "expired"
  );
  const plannedCertifications = certifications.filter(
    (c) => c.status === "planned"
  );

  const totalInvestment = certifications.reduce(
    (sum, cert) => sum + cert.cost,
    0
  );
  const averageScore =
    activeCertifications.length > 0
      ? Math.round(
          activeCertifications.reduce(
            (sum, cert) => sum + (cert.score || 0),
            0
          ) / activeCertifications.length
        )
      : 0;

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
          <h1 className="text-3xl font-bold">Certifications</h1>
          <p className="text-gray-600 mt-2">
            Manage your professional certifications and track your learning
            progress
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Certifications
                </p>
                <p className="text-2xl font-bold">
                  {activeCertifications.length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">
                  {inProgressCertifications.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Investment
                </p>
                <p className="text-2xl font-bold">${totalInvestment}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certification Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Certification Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="p-4 border rounded-[10px] hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(provider.category)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-[10px]">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.category}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Reputation:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {provider.reputation}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Certifications:</span>
                    <span className="font-medium">
                      {provider.totalCertifications}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>My Certs:</span>
                    <span className="font-medium">
                      {provider.certifications.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({certifications.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeCertifications.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCertifications.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredCertifications.length})
          </TabsTrigger>
          <TabsTrigger value="planned">
            Planned ({plannedCertifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {activeCertifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Active Certifications
                </h3>
                <p className="text-gray-600 mb-4">
                  Start earning certifications to boost your career.
                </p>
                <Button>Explore Certifications</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeCertifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-6">
          {inProgressCertifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Certifications in Progress
                </h3>
                <p className="text-gray-600">
                  Start working on a certification to see it here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inProgressCertifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-6">
          {expiredCertifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Expired Certifications
                </h3>
                <p className="text-gray-600">
                  Great! All your certifications are current.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {expiredCertifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="planned" className="space-y-6">
          {plannedCertifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Planned Certifications
                </h3>
                <p className="text-gray-600 mb-4">
                  Plan your next certification to advance your career.
                </p>
                <Button>Browse Certifications</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plannedCertifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CertificationCard({
  certification,
}: {
  certification: Certification;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cloud & DevOps":
        return Cloud;
      case "Frontend Development":
        return Globe;
      case "Programming Languages":
        return Code;
      case "Data & Analytics":
        return Database;
      case "Cybersecurity":
        return Shield;
      default:
        return Award;
    }
  };

  const CategoryIcon = getCategoryIcon(certification.category);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <CategoryIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{certification.name}</h3>
                <p className="text-sm text-gray-600">
                  {certification.provider}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getLevelColor(certification.level)}>
                {certification.level}
              </Badge>
              <Badge className={getStatusColor(certification.status)}>
                {certification.status}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm">{certification.description}</p>

          {/* Progress for in-progress certifications */}
          {certification.status === "in-progress" && certification.progress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress:</span>
                <span className="font-medium">{certification.progress}%</span>
              </div>
              <Progress value={certification.progress} className="h-2" />
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {certification.earnedDate && (
              <div>
                <span className="text-gray-600">Earned:</span>
                <span className="ml-2 font-medium">
                  {new Date(certification.earnedDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {certification.expiryDate && (
              <div>
                <span className="text-gray-600">Expires:</span>
                <span className="ml-2 font-medium">
                  {new Date(certification.expiryDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {certification.score && (
              <div>
                <span className="text-gray-600">Score:</span>
                <span className="ml-2 font-medium">{certification.score}%</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Cost:</span>
              <span className="ml-2 font-medium">
                ${certification.cost} {certification.currency}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm font-medium mb-2">Skills:</p>
            <div className="flex flex-wrap gap-1">
              {certification.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {certification.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{certification.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            {certification.status === "active" && (
              <>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </>
            )}
            {certification.status === "in-progress" && (
              <Button size="sm" className="flex-1">
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            )}
            {certification.status === "expired" && (
              <Button size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Renew
              </Button>
            )}
            {certification.status === "planned" && (
              <Button size="sm" className="flex-1">
                <Target className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
