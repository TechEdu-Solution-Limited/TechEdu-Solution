"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Target,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  Star,
  Clock,
  Plus,
  Edit,
  Download,
  Share2,
  RefreshCw,
  Briefcase,
  Users,
  Code,
  BookOpen,
  Zap,
  Globe,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "job" | "education" | "certification" | "project" | "achievement";
  company?: string;
  location?: string;
  duration?: string;
  impact?: string;
  skills?: string[];
}

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: "on-track" | "behind" | "completed" | "overdue";
  category: "skill" | "position" | "salary" | "certification" | "project";
  priority: "high" | "medium" | "low";
}

interface CareerStats {
  totalExperience: number;
  companiesWorked: number;
  projectsCompleted: number;
  certificationsEarned: number;
  averageRating: number;
  skillsMastered: number;
  promotions: number;
  salaryGrowth: number;
}

export default function CareerSnapshotPage() {
  const { userData } = useRole();
  const [milestones, setMilestones] = useState<CareerMilestone[]>([]);
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMilestones: CareerMilestone[] = [
      {
        id: "1",
        title: "Senior Software Engineer",
        description:
          "Promoted to senior role with team leadership responsibilities",
        date: "2023-06-15",
        type: "job",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        duration: "2 years",
        impact: "Led 3 major projects, mentored 5 junior developers",
        skills: ["Leadership", "Project Management", "React", "Node.js"],
      },
      {
        id: "2",
        title: "AWS Solutions Architect Certification",
        description: "Earned AWS Solutions Architect Associate certification",
        date: "2023-03-20",
        type: "certification",
        company: "Amazon Web Services",
        impact:
          "Enhanced cloud architecture skills, improved project scalability",
        skills: ["AWS", "Cloud Architecture", "DevOps"],
      },
      {
        id: "3",
        title: "E-commerce Platform Project",
        description:
          "Led development of company's flagship e-commerce platform",
        date: "2022-11-10",
        type: "project",
        company: "TechCorp Inc.",
        duration: "8 months",
        impact: "Increased revenue by 40%, improved user experience",
        skills: ["React", "Node.js", "MongoDB", "Payment Integration"],
      },
      {
        id: "4",
        title: "Master's in Computer Science",
        description:
          "Completed Master's degree with focus on software engineering",
        date: "2021-05-15",
        type: "education",
        company: "Stanford University",
        location: "Stanford, CA",
        duration: "2 years",
        impact: "Enhanced technical knowledge, expanded professional network",
        skills: ["Advanced Algorithms", "Machine Learning", "Research"],
      },
      {
        id: "5",
        title: "Software Engineer",
        description: "Started first full-time software engineering position",
        date: "2019-08-01",
        type: "job",
        company: "StartupXYZ",
        location: "Austin, TX",
        duration: "2 years",
        impact: "Built core product features, learned agile development",
        skills: ["JavaScript", "React", "Agile", "Startup Culture"],
      },
    ];

    const mockGoals: CareerGoal[] = [
      {
        id: "1",
        title: "Become Tech Lead",
        description:
          "Advance to technical leadership role with team management",
        targetDate: "2024-12-31",
        progress: 75,
        status: "on-track",
        category: "position",
        priority: "high",
      },
      {
        id: "2",
        title: "Learn Machine Learning",
        description: "Complete ML certification and build ML-powered features",
        targetDate: "2024-06-30",
        progress: 45,
        status: "behind",
        category: "skill",
        priority: "medium",
      },
      {
        id: "3",
        title: "Reach $150k Salary",
        description:
          "Achieve target salary through promotions and negotiations",
        targetDate: "2024-12-31",
        progress: 85,
        status: "on-track",
        category: "salary",
        priority: "high",
      },
      {
        id: "4",
        title: "Open Source Contribution",
        description: "Contribute to major open source projects",
        targetDate: "2024-08-31",
        progress: 30,
        status: "behind",
        category: "project",
        priority: "medium",
      },
      {
        id: "5",
        title: "Kubernetes Certification",
        description: "Earn Kubernetes Administrator certification",
        targetDate: "2024-05-31",
        progress: 60,
        status: "on-track",
        category: "certification",
        priority: "low",
      },
    ];

    const mockStats: CareerStats = {
      totalExperience: 5,
      companiesWorked: 3,
      projectsCompleted: 15,
      certificationsEarned: 4,
      averageRating: 4.8,
      skillsMastered: 12,
      promotions: 2,
      salaryGrowth: 65,
    };

    setTimeout(() => {
      setMilestones(mockMilestones);
      setGoals(mockGoals);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800";
      case "behind":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "job":
        return Briefcase;
      case "education":
        return GraduationCap;
      case "certification":
        return Award;
      case "project":
        return Code;
      case "achievement":
        return Star;
      default:
        return Target;
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

  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const onTrackGoals = goals.filter((goal) => goal.status === "on-track");
  const behindGoals = goals.filter((goal) => goal.status === "behind");

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
          <h1 className="text-3xl font-bold">Career Snapshot</h1>
          <p className="text-gray-600 mt-2">
            Your professional journey, achievements, and future goals
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Career Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Experience
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalExperience} years
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
                    Companies Worked
                  </p>
                  <p className="text-2xl font-bold">{stats.companiesWorked}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-[10px]">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Projects Completed
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.projectsCompleted}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-[10px]">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.averageRating}/5.0
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-[10px]">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Career Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Career Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone, index) => {
                const MilestoneIcon = getMilestoneIcon(milestone.type);
                return (
                  <div key={milestone.id} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="p-2 bg-blue-100 rounded-[10px]">
                        <MilestoneIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{milestone.title}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {milestone.description}
                      </p>
                      {milestone.company && (
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Building className="w-4 h-4 mr-1" />
                          {milestone.company}
                          {milestone.location && (
                            <>
                              <span className="mx-1">•</span>
                              <MapPin className="w-4 h-4 mr-1" />
                              {milestone.location}
                            </>
                          )}
                        </div>
                      )}
                      {milestone.duration && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock className="w-4 h-4 mr-1" />
                          {milestone.duration}
                        </div>
                      )}
                      {milestone.impact && (
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <strong>Impact:</strong> {milestone.impact}
                        </div>
                      )}
                      {milestone.skills && milestone.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {milestone.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Career Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>On Track:</span>
                <span className="font-medium text-green-600">
                  {onTrackGoals.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Behind:</span>
                <span className="font-medium text-yellow-600">
                  {behindGoals.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Completed:</span>
                <span className="font-medium text-blue-600">
                  {completedGoals.length}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-3 border rounded-[10px]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                    <Badge className={getGoalStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{goal.progress}% complete</span>
                    <span>
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              View All Goals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Goals Management */}
      <Card>
        <CardHeader>
          <CardTitle>Career Goals Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Goals ({goals.length})</TabsTrigger>
              <TabsTrigger value="on-track">
                On Track ({onTrackGoals.length})
              </TabsTrigger>
              <TabsTrigger value="behind">
                Behind ({behindGoals.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedGoals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="on-track" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {onTrackGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="behind" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {behindGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function GoalCard({ goal }: { goal: CareerGoal }) {
  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800";
      case "behind":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "skill":
        return BookOpen;
      case "position":
        return Briefcase;
      case "salary":
        return TrendingUp;
      case "certification":
        return Award;
      case "project":
        return Code;
      default:
        return Target;
    }
  };

  const CategoryIcon = getCategoryIcon(goal.category);

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
                <h3 className="font-semibold">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(goal.priority)}>
                {goal.priority}
              </Badge>
              <Badge className={getGoalStatusColor(goal.status)}>
                {goal.status}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress:</span>
              <span className="font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Target: {new Date(goal.targetDate).toLocaleDateString()}
            </div>
            <span className="capitalize">{goal.category}</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Update
            </Button>
            <Button size="sm" variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Track
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
