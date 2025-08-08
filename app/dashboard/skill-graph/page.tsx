"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Target,
  Star,
  Clock,
  Award,
  Plus,
  Edit,
  Download,
  Share2,
  RefreshCw,
  Zap,
  BookOpen,
  Code,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Shield,
  Palette,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  experience: number; // years
  lastUsed: string;
  demand: "high" | "medium" | "low";
  trending: "up" | "down" | "stable";
  certifications: string[];
  projects: number;
  recommendations: string[];
}

interface SkillCategory {
  name: string;
  skills: Skill[];
  averageProficiency: number;
  totalExperience: number;
  demandScore: number;
}

export default function SkillGraphPage() {
  const { userData } = useRole();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"radar" | "bar" | "list">("radar");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSkills: Skill[] = [
      {
        id: "1",
        name: "JavaScript",
        category: "Programming Languages",
        proficiency: 85,
        experience: 4,
        lastUsed: "2024-01-20",
        demand: "high",
        trending: "up",
        certifications: ["JavaScript Developer Certificate"],
        projects: 12,
        recommendations: ["Learn TypeScript", "Explore React Native"],
      },
      {
        id: "2",
        name: "React",
        category: "Frontend Frameworks",
        proficiency: 78,
        experience: 3,
        lastUsed: "2024-01-18",
        demand: "high",
        trending: "up",
        certifications: ["React Developer Certificate"],
        projects: 8,
        recommendations: ["Learn Next.js", "Explore State Management"],
      },
      {
        id: "3",
        name: "Node.js",
        category: "Backend Technologies",
        proficiency: 72,
        experience: 2,
        lastUsed: "2024-01-15",
        demand: "high",
        trending: "stable",
        certifications: ["Node.js Developer Certificate"],
        projects: 6,
        recommendations: ["Learn Express.js", "Explore Microservices"],
      },
      {
        id: "4",
        name: "Python",
        category: "Programming Languages",
        proficiency: 65,
        experience: 2,
        lastUsed: "2024-01-10",
        demand: "high",
        trending: "up",
        certifications: ["Python Developer Certificate"],
        projects: 4,
        recommendations: ["Learn Data Science", "Explore Machine Learning"],
      },
      {
        id: "5",
        name: "AWS",
        category: "Cloud & DevOps",
        proficiency: 60,
        experience: 1,
        lastUsed: "2024-01-12",
        demand: "high",
        trending: "up",
        certifications: ["AWS Solutions Architect"],
        projects: 3,
        recommendations: ["Learn Docker", "Explore Kubernetes"],
      },
      {
        id: "6",
        name: "MongoDB",
        category: "Databases",
        proficiency: 70,
        experience: 2,
        lastUsed: "2024-01-16",
        demand: "medium",
        trending: "stable",
        certifications: ["MongoDB Developer"],
        projects: 5,
        recommendations: ["Learn PostgreSQL", "Explore Redis"],
      },
      {
        id: "7",
        name: "Docker",
        category: "Cloud & DevOps",
        proficiency: 55,
        experience: 1,
        lastUsed: "2024-01-14",
        demand: "high",
        trending: "up",
        certifications: ["Docker Certified Associate"],
        projects: 2,
        recommendations: ["Learn Kubernetes", "Explore CI/CD"],
      },
      {
        id: "8",
        name: "TypeScript",
        category: "Programming Languages",
        proficiency: 45,
        experience: 1,
        lastUsed: "2024-01-19",
        demand: "high",
        trending: "up",
        certifications: [],
        projects: 3,
        recommendations: [
          "Complete TypeScript Course",
          "Practice Advanced Types",
        ],
      },
    ];

    setTimeout(() => {
      setSkills(mockSkills);
      setLoading(false);
    }, 1000);
  }, []);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case "stable":
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Programming Languages":
        return Code;
      case "Frontend Frameworks":
        return Palette;
      case "Backend Technologies":
        return Database;
      case "Cloud & DevOps":
        return Cloud;
      case "Databases":
        return Database;
      case "Mobile Development":
        return Smartphone;
      case "AI & Machine Learning":
        return Zap;
      case "Cybersecurity":
        return Shield;
      case "Web Technologies":
        return Globe;
      default:
        return Code;
    }
  };

  const categories = skills.reduce((acc: SkillCategory[], skill) => {
    const existingCategory = acc.find((cat) => cat.name === skill.category);
    if (existingCategory) {
      existingCategory.skills.push(skill);
      existingCategory.averageProficiency = Math.round(
        existingCategory.skills.reduce((sum, s) => sum + s.proficiency, 0) /
          existingCategory.skills.length
      );
      existingCategory.totalExperience += skill.experience;
      existingCategory.demandScore +=
        skill.demand === "high" ? 3 : skill.demand === "medium" ? 2 : 1;
    } else {
      acc.push({
        name: skill.category,
        skills: [skill],
        averageProficiency: skill.proficiency,
        totalExperience: skill.experience,
        demandScore:
          skill.demand === "high" ? 3 : skill.demand === "medium" ? 2 : 1,
      });
    }
    return acc;
  }, []);

  const filteredSkills =
    selectedCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === selectedCategory);

  const totalSkills = skills.length;
  const averageProficiency = Math.round(
    skills.reduce((sum, skill) => sum + skill.proficiency, 0) / totalSkills
  );
  const highDemandSkills = skills.filter(
    (skill) => skill.demand === "high"
  ).length;
  const trendingUpSkills = skills.filter(
    (skill) => skill.trending === "up"
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
          <h1 className="text-3xl font-bold">Skill Graph</h1>
          <p className="text-gray-600 mt-2">
            Visualize your technical skills and track your professional growth
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
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
                  Total Skills
                </p>
                <p className="text-2xl font-bold">{totalSkills}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Proficiency
                </p>
                <p className="text-2xl font-bold">{averageProficiency}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
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
                  High Demand Skills
                </p>
                <p className="text-2xl font-bold">{highDemandSkills}</p>
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
                <p className="text-sm font-medium text-gray-600">Trending Up</p>
                <p className="text-2xl font-bold">{trendingUpSkills}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const CategoryIcon = getCategoryIcon(category.name);
              return (
                <div
                  key={category.name}
                  className="p-4 border rounded-[10px] hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-[10px]">
                      <CategoryIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {category.skills.length} skills
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Avg. Proficiency:</span>
                      <span className="font-medium">
                        {category.averageProficiency}%
                      </span>
                    </div>
                    <Progress
                      value={category.averageProficiency}
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Experience: {category.totalExperience} years</span>
                      <Badge
                        className={getDemandColor(
                          category.demandScore / category.skills.length >= 2.5
                            ? "high"
                            : category.demandScore / category.skills.length >=
                              1.5
                            ? "medium"
                            : "low"
                        )}
                      >
                        {category.demandScore / category.skills.length >= 2.5
                          ? "High"
                          : category.demandScore / category.skills.length >= 1.5
                          ? "Medium"
                          : "Low"}{" "}
                        Demand
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Skills Tabs */}
      <Tabs defaultValue="radar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="radar">Radar View</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="radar" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Radar Chart</h3>
                <p className="text-gray-600 mb-4">
                  Interactive radar chart showing your skill proficiency across
                  categories.
                </p>
                <Button>Generate Radar Chart</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
                <p className="text-gray-600 mb-4">
                  Bar chart visualization of your skills and proficiency levels.
                </p>
                <Button>Generate Bar Chart</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case "stable":
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{skill.name}</h3>
              <p className="text-sm text-gray-600">{skill.category}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getDemandColor(skill.demand)}>
                {skill.demand} demand
              </Badge>
              {getTrendingIcon(skill.trending)}
            </div>
          </div>

          {/* Proficiency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Proficiency:</span>
              <span className="font-medium">{skill.proficiency}%</span>
            </div>
            <Progress value={skill.proficiency} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Experience:</span>
              <span className="ml-2 font-medium">{skill.experience} years</span>
            </div>
            <div>
              <span className="text-gray-600">Projects:</span>
              <span className="ml-2 font-medium">{skill.projects}</span>
            </div>
            <div>
              <span className="text-gray-600">Last Used:</span>
              <span className="ml-2 font-medium">
                {new Date(skill.lastUsed).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Certifications:</span>
              <span className="ml-2 font-medium">
                {skill.certifications.length}
              </span>
            </div>
          </div>

          {/* Certifications */}
          {skill.certifications.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Certifications:</p>
              <div className="flex flex-wrap gap-1">
                {skill.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {skill.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Recommendations:</p>
              <div className="space-y-1">
                {skill.recommendations.slice(0, 2).map((rec, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    <Zap className="w-3 h-3 mr-2 text-yellow-500" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Update
            </Button>
            <Button size="sm" variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </Button>
            <Button size="sm" variant="outline">
              <Award className="w-4 h-4 mr-2" />
              Certify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
