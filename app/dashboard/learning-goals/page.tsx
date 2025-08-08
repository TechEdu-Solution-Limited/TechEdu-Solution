"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: "academic" | "career" | "skill" | "certification" | "personal";
  priority: "low" | "medium" | "high";
  status: "not-started" | "in-progress" | "completed" | "paused";
  progress: number; // 0-100
  targetDate: string;
  startDate: string;
  completedDate?: string;
  milestones: Milestone[];
  tags: string[];
  estimatedHours: number;
  actualHours?: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  completedDate?: string;
}

export default function LearningGoalsPage() {
  const { userData } = useRole();
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

  // Form state for adding/editing goals
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "academic" as const,
    priority: "medium" as const,
    targetDate: "",
    estimatedHours: 0,
    tags: "",
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockGoals: LearningGoal[] = [
      {
        id: "1",
        title: "Complete AWS Solutions Architect Certification",
        description:
          "Achieve AWS Solutions Architect Associate certification to enhance cloud computing skills and career prospects.",
        category: "certification",
        priority: "high",
        status: "in-progress",
        progress: 65,
        targetDate: "2024-03-15",
        startDate: "2024-01-01",
        estimatedHours: 120,
        actualHours: 78,
        tags: ["aws", "cloud", "certification"],
        milestones: [
          {
            id: "m1",
            title: "Complete AWS Fundamentals Course",
            description: "Finish the basic AWS concepts and services course",
            completed: true,
            dueDate: "2024-01-15",
            completedDate: "2024-01-12",
          },
          {
            id: "m2",
            title: "Practice with Hands-on Labs",
            description: "Complete 20+ hands-on labs for practical experience",
            completed: true,
            dueDate: "2024-01-30",
            completedDate: "2024-01-28",
          },
          {
            id: "m3",
            title: "Take Practice Exams",
            description: "Complete 5 practice exams with 80%+ score",
            completed: false,
            dueDate: "2024-02-15",
          },
          {
            id: "m4",
            title: "Schedule and Take Certification Exam",
            description: "Book and pass the official AWS certification exam",
            completed: false,
            dueDate: "2024-03-15",
          },
        ],
      },
      {
        id: "2",
        title: "Improve Data Science Skills",
        description:
          "Develop proficiency in Python, machine learning, and data analysis to prepare for data science roles.",
        category: "skill",
        priority: "medium",
        status: "in-progress",
        progress: 40,
        targetDate: "2024-06-30",
        startDate: "2024-01-10",
        estimatedHours: 200,
        actualHours: 80,
        tags: ["python", "machine-learning", "data-science"],
        milestones: [
          {
            id: "m5",
            title: "Complete Python for Data Science Course",
            description:
              "Master Python programming fundamentals for data analysis",
            completed: true,
            dueDate: "2024-02-01",
            completedDate: "2024-01-25",
          },
          {
            id: "m6",
            title: "Learn Pandas and NumPy",
            description: "Become proficient in data manipulation libraries",
            completed: false,
            dueDate: "2024-03-01",
          },
          {
            id: "m7",
            title: "Complete Machine Learning Course",
            description:
              "Learn supervised and unsupervised learning algorithms",
            completed: false,
            dueDate: "2024-05-01",
          },
          {
            id: "m8",
            title: "Build Portfolio Projects",
            description: "Create 3-5 data science projects for portfolio",
            completed: false,
            dueDate: "2024-06-15",
          },
        ],
      },
      {
        id: "3",
        title: "Maintain 3.8+ GPA",
        description:
          "Achieve and maintain a GPA of 3.8 or higher throughout the academic year.",
        category: "academic",
        priority: "high",
        status: "in-progress",
        progress: 85,
        targetDate: "2024-05-15",
        startDate: "2024-01-01",
        estimatedHours: 0,
        tags: ["academic", "gpa", "performance"],
        milestones: [
          {
            id: "m9",
            title: "Complete Fall Semester with 3.8+ GPA",
            description: "Achieve target GPA in fall semester courses",
            completed: true,
            dueDate: "2024-01-15",
            completedDate: "2024-01-10",
          },
          {
            id: "m10",
            title: "Maintain Spring Semester Performance",
            description: "Continue strong academic performance in spring",
            completed: false,
            dueDate: "2024-05-15",
          },
        ],
      },
      {
        id: "4",
        title: "Learn React and Frontend Development",
        description:
          "Master React.js and modern frontend development practices for web development roles.",
        category: "skill",
        priority: "medium",
        status: "not-started",
        progress: 0,
        targetDate: "2024-08-30",
        startDate: "2024-03-01",
        estimatedHours: 150,
        tags: ["react", "frontend", "javascript"],
        milestones: [
          {
            id: "m11",
            title: "Learn JavaScript Fundamentals",
            description: "Master ES6+ JavaScript concepts",
            completed: false,
            dueDate: "2024-04-01",
          },
          {
            id: "m12",
            title: "Complete React Course",
            description: "Learn React hooks, components, and state management",
            completed: false,
            dueDate: "2024-06-01",
          },
          {
            id: "m13",
            title: "Build React Projects",
            description: "Create 3-4 React applications for portfolio",
            completed: false,
            dueDate: "2024-08-15",
          },
        ],
      },
      {
        id: "5",
        title: "Network with Industry Professionals",
        description:
          "Attend 10+ networking events and connect with 50+ professionals in the tech industry.",
        category: "career",
        priority: "low",
        status: "in-progress",
        progress: 30,
        targetDate: "2024-12-31",
        startDate: "2024-01-01",
        estimatedHours: 50,
        actualHours: 15,
        tags: ["networking", "career", "professional"],
        milestones: [
          {
            id: "m14",
            title: "Attend 5 Local Meetups",
            description: "Participate in local tech meetups and events",
            completed: false,
            dueDate: "2024-06-30",
          },
          {
            id: "m15",
            title: "Join Professional Organizations",
            description:
              "Become a member of relevant professional associations",
            completed: true,
            dueDate: "2024-02-01",
            completedDate: "2024-01-20",
          },
          {
            id: "m16",
            title: "Connect on LinkedIn",
            description: "Build professional network with 50+ connections",
            completed: false,
            dueDate: "2024-12-31",
          },
        ],
      },
    ];

    setTimeout(() => {
      setGoals(mockGoals);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
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
      case "academic":
        return BookOpen;
      case "career":
        return Target;
      case "skill":
        return TrendingUp;
      case "certification":
        return Award;
      case "personal":
        return Star;
      default:
        return Target;
    }
  };

  const toggleGoalExpansion = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const handleAddGoal = () => {
    if (!formData.title || !formData.description) return;

    const newGoal: LearningGoal = {
      id: `goal-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: "not-started",
      progress: 0,
      targetDate: formData.targetDate,
      startDate: new Date().toISOString().split("T")[0],
      estimatedHours: formData.estimatedHours,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      milestones: [],
    };

    setGoals((prev) => [newGoal, ...prev]);
    setShowAddGoal(false);
    setFormData({
      title: "",
      description: "",
      category: "academic",
      priority: "medium",
      targetDate: "",
      estimatedHours: 0,
      tags: "",
    });
  };

  const updateGoalProgress = (
    goalId: string,
    milestoneId: string,
    completed: boolean
  ) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? {
                  ...milestone,
                  completed,
                  completedDate: completed
                    ? new Date().toISOString().split("T")[0]
                    : undefined,
                }
              : milestone
          );

          const completedMilestones = updatedMilestones.filter(
            (m) => m.completed
          ).length;
          const progress =
            updatedMilestones.length > 0
              ? Math.round(
                  (completedMilestones / updatedMilestones.length) * 100
                )
              : 0;

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
            status:
              progress === 100
                ? "completed"
                : progress > 0
                ? "in-progress"
                : "not-started",
            completedDate:
              progress === 100
                ? new Date().toISOString().split("T")[0]
                : goal.completedDate,
          };
        }
        return goal;
      })
    );
  };

  const filteredGoals = goals;
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const inProgressGoals = goals.filter((goal) => goal.status === "in-progress");
  const notStartedGoals = goals.filter((goal) => goal.status === "not-started");

  const totalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
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
          <h1 className="text-3xl font-bold">Learning Goals</h1>
          <p className="text-gray-600 mt-2">
            Set, track, and achieve your academic and career objectives
          </p>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{inProgressGoals.length}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
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
                <p className="text-sm font-medium text-gray-600">
                  Avg. Progress
                </p>
                <p className="text-2xl font-bold">{totalProgress}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Learning Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter your learning goal"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your goal in detail"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as any,
                      }))
                    }
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="academic">Academic</option>
                    <option value="career">Career</option>
                    <option value="skill">Skill Development</option>
                    <option value="certification">Certification</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: e.target.value as any,
                      }))
                    }
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        targetDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        estimatedHours: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="e.g., python, machine-learning, career"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAddGoal}>Add Goal</Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle>My Learning Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No learning goals yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first learning goal to track your progress.
              </p>
              <Button onClick={() => setShowAddGoal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGoals.map((goal) => {
                const CategoryIcon = getCategoryIcon(goal.category);
                const isExpanded = expandedGoals.has(goal.id);

                return (
                  <Card
                    key={goal.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Goal Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-[10px]">
                              <CategoryIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {goal.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge className={getStatusColor(goal.status)}>
                              {goal.status.replace("-", " ")}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleGoalExpansion(goal.id)}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>

                        {/* Goal Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Target Date:</span>
                            <p className="font-medium">
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Estimated Hours:
                            </span>
                            <p className="font-medium">
                              {goal.estimatedHours}h
                            </p>
                          </div>
                          {goal.actualHours && (
                            <div>
                              <span className="text-gray-600">
                                Actual Hours:
                              </span>
                              <p className="font-medium">{goal.actualHours}h</p>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">Milestones:</span>
                            <p className="font-medium">
                              {
                                goal.milestones.filter((m) => m.completed)
                                  .length
                              }
                              /{goal.milestones.length}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        {goal.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {goal.tags.map((tag) => (
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

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t pt-4 space-y-4">
                            {/* Milestones */}
                            <div>
                              <h4 className="font-medium mb-3">Milestones</h4>
                              <div className="space-y-2">
                                {goal.milestones.map((milestone) => (
                                  <div
                                    key={milestone.id}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={milestone.completed}
                                      onChange={(e) =>
                                        updateGoalProgress(
                                          goal.id,
                                          milestone.id,
                                          e.target.checked
                                        )
                                      }
                                      className="rounded"
                                    />
                                    <div className="flex-1">
                                      <p
                                        className={`font-medium ${
                                          milestone.completed
                                            ? "line-through text-gray-500"
                                            : ""
                                        }`}
                                      >
                                        {milestone.title}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {milestone.description}
                                      </p>
                                      {milestone.dueDate && (
                                        <p className="text-xs text-gray-500">
                                          Due:{" "}
                                          {new Date(
                                            milestone.dueDate
                                          ).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                    {milestone.completed &&
                                      milestone.completedDate && (
                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                          Completed{" "}
                                          {new Date(
                                            milestone.completedDate
                                          ).toLocaleDateString()}
                                        </Badge>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Goal
                              </Button>
                              <Button size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Milestone
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
