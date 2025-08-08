"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  Star,
  Clock,
  Plus,
  Edit,
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  Code,
  Building,
  Globe,
  Shield,
  Database,
  Cloud,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  BarChart3,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Award,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Filter,
  Search,
  Brain,
  Rocket,
  Bookmark,
  Heart,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface AITip {
  id: string;
  category:
    | "career"
    | "interview"
    | "skill"
    | "networking"
    | "salary"
    | "leadership";
  title: string;
  description: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeToImplement: string;
  impact: "high" | "medium" | "low";
  confidence: number; // 0-100
  tags: string[];
  resources: {
    title: string;
    url: string;
    type: "article" | "video" | "course" | "book";
  }[];
  relatedTips: string[];
  createdAt: string;
  lastUpdated: string;
  isBookmarked: boolean;
  isLiked: boolean;
  views: number;
  likes: number;
}

interface TipCategory {
  name: string;
  icon: any;
  count: number;
  description: string;
  color: string;
}

interface TipInsight {
  id: string;
  type: "trend" | "opportunity" | "warning" | "success";
  title: string;
  description: string;
  data: any;
  recommendations: string[];
}

export default function AITipsPage() {
  const { userData } = useRole();
  const [tips, setTips] = useState<AITip[]>([]);
  const [insights, setInsights] = useState<TipInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("relevance");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTips: AITip[] = [
      {
        id: "1",
        category: "interview",
        title: "Master the STAR Method for Behavioral Interviews",
        description:
          "Learn to structure your responses using Situation, Task, Action, Result framework for compelling interview answers.",
        content:
          "The STAR method is a structured approach to answering behavioral interview questions. Start by describing the Situation, explain the Task you needed to accomplish, detail the Actions you took, and conclude with the Results you achieved. This framework helps you provide comprehensive, organized responses that showcase your problem-solving abilities and achievements.",
        difficulty: "intermediate",
        timeToImplement: "2-3 hours",
        impact: "high",
        confidence: 95,
        tags: ["Interview", "STAR Method", "Behavioral", "Communication"],
        resources: [
          {
            title: "STAR Method Guide",
            url: "https://example.com/star-method",
            type: "article",
          },
          {
            title: "Behavioral Interview Practice",
            url: "https://example.com/practice",
            type: "video",
          },
        ],
        relatedTips: ["2", "5"],
        createdAt: "2024-01-15",
        lastUpdated: "2024-01-20",
        isBookmarked: true,
        isLiked: true,
        views: 245,
        likes: 89,
      },
      {
        id: "2",
        category: "career",
        title: "Build a Personal Brand on LinkedIn",
        description:
          "Create a compelling professional presence that attracts recruiters and networking opportunities.",
        content:
          "Your LinkedIn profile is often the first impression potential employers have of you. Optimize your headline, write a compelling summary, showcase your achievements with metrics, and regularly share industry insights. Engage with others' content and post your own thoughts to establish yourself as a thought leader in your field.",
        difficulty: "beginner",
        timeToImplement: "4-6 hours",
        impact: "high",
        confidence: 92,
        tags: ["LinkedIn", "Personal Brand", "Networking", "Social Media"],
        resources: [
          {
            title: "LinkedIn Profile Optimization",
            url: "https://example.com/linkedin-guide",
            type: "article",
          },
          {
            title: "Personal Branding Course",
            url: "https://example.com/branding-course",
            type: "course",
          },
        ],
        relatedTips: ["1", "6"],
        createdAt: "2024-01-12",
        lastUpdated: "2024-01-18",
        isBookmarked: false,
        isLiked: true,
        views: 189,
        likes: 67,
      },
      {
        id: "3",
        category: "skill",
        title: "Learn TypeScript for Better JavaScript Development",
        description:
          "TypeScript adds type safety to JavaScript, making your code more maintainable and reducing bugs.",
        content:
          "TypeScript is becoming essential for modern JavaScript development. Start with basic types, learn interfaces and classes, understand generics, and practice with real projects. The type safety will catch errors early and make your codebase more maintainable as it grows.",
        difficulty: "intermediate",
        timeToImplement: "2-4 weeks",
        impact: "high",
        confidence: 88,
        tags: ["TypeScript", "JavaScript", "Programming", "Type Safety"],
        resources: [
          {
            title: "TypeScript Official Handbook",
            url: "https://example.com/typescript-handbook",
            type: "book",
          },
          {
            title: "TypeScript for React Developers",
            url: "https://example.com/react-typescript",
            type: "course",
          },
        ],
        relatedTips: ["4", "7"],
        createdAt: "2024-01-10",
        lastUpdated: "2024-01-16",
        isBookmarked: true,
        isLiked: false,
        views: 156,
        likes: 45,
      },
      {
        id: "4",
        category: "salary",
        title: "Negotiate Your Salary Like a Pro",
        description:
          "Learn proven strategies to negotiate better compensation packages and benefits.",
        content:
          "Salary negotiation is a crucial skill. Research market rates, prepare your value proposition, practice your pitch, and be ready to discuss total compensation including benefits. Remember that negotiation is a conversation, not a confrontation.",
        difficulty: "intermediate",
        timeToImplement: "3-5 hours",
        impact: "high",
        confidence: 85,
        tags: ["Salary", "Negotiation", "Compensation", "Career"],
        resources: [
          {
            title: "Salary Negotiation Guide",
            url: "https://example.com/salary-guide",
            type: "article",
          },
          {
            title: "Negotiation Masterclass",
            url: "https://example.com/negotiation-course",
            type: "course",
          },
        ],
        relatedTips: ["2", "8"],
        createdAt: "2024-01-08",
        lastUpdated: "2024-01-14",
        isBookmarked: false,
        isLiked: true,
        views: 203,
        likes: 78,
      },
      {
        id: "5",
        category: "networking",
        title: "Build Meaningful Professional Relationships",
        description:
          "Develop authentic connections that can lead to career opportunities and mentorship.",
        content:
          "Networking is about building genuine relationships, not just collecting contacts. Attend industry events, join professional groups, offer value to others, and follow up consistently. Focus on quality over quantity in your connections.",
        difficulty: "beginner",
        timeToImplement: "Ongoing",
        impact: "medium",
        confidence: 90,
        tags: [
          "Networking",
          "Relationships",
          "Mentorship",
          "Professional Development",
        ],
        resources: [
          {
            title: "Networking Strategies",
            url: "https://example.com/networking-guide",
            type: "article",
          },
          {
            title: "Building Professional Relationships",
            url: "https://example.com/relationships-book",
            type: "book",
          },
        ],
        relatedTips: ["2", "9"],
        createdAt: "2024-01-05",
        lastUpdated: "2024-01-12",
        isBookmarked: true,
        isLiked: true,
        views: 134,
        likes: 52,
      },
      {
        id: "6",
        category: "leadership",
        title: "Develop Your Leadership Skills",
        description:
          "Build the skills needed to lead teams and advance to senior positions.",
        content:
          "Leadership is about influence, not just authority. Develop emotional intelligence, learn to delegate effectively, communicate clearly, and lead by example. Start by taking on small leadership opportunities and gradually build your capabilities.",
        difficulty: "advanced",
        timeToImplement: "6-12 months",
        impact: "high",
        confidence: 82,
        tags: ["Leadership", "Management", "Soft Skills", "Career Growth"],
        resources: [
          {
            title: "Leadership Fundamentals",
            url: "https://example.com/leadership-course",
            type: "course",
          },
          {
            title: "The Leadership Challenge",
            url: "https://example.com/leadership-book",
            type: "book",
          },
        ],
        relatedTips: ["2", "10"],
        createdAt: "2024-01-03",
        lastUpdated: "2024-01-10",
        isBookmarked: false,
        isLiked: false,
        views: 98,
        likes: 34,
      },
    ];

    const mockInsights: TipInsight[] = [
      {
        id: "1",
        type: "trend",
        title: "TypeScript Adoption Rising",
        description:
          "TypeScript is becoming standard in modern web development",
        data: { adoptionRate: 75, growth: 25 },
        recommendations: [
          "Start learning TypeScript basics",
          "Convert existing JavaScript projects",
          "Practice with real-world scenarios",
        ],
      },
      {
        id: "2",
        type: "opportunity",
        title: "Remote Leadership Skills in Demand",
        description:
          "Companies are seeking leaders who can manage remote teams effectively",
        data: { demandIncrease: 40, salaryPremium: 15 },
        recommendations: [
          "Develop virtual communication skills",
          "Learn remote team management tools",
          "Practice leading distributed teams",
        ],
      },
      {
        id: "3",
        type: "warning",
        title: "Interview Process Getting Longer",
        description: "Technical interviews are becoming more comprehensive",
        data: { averageRounds: 5, preparationTime: "2-4 weeks" },
        recommendations: [
          "Start preparing earlier",
          "Practice system design questions",
          "Build a portfolio of projects",
        ],
      },
    ];

    setTimeout(() => {
      setTips(mockTips);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  const categories: TipCategory[] = [
    {
      name: "Career",
      icon: TrendingUp,
      count: tips.filter((t) => t.category === "career").length,
      description: "Career advancement strategies",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Interview",
      icon: MessageCircle,
      count: tips.filter((t) => t.category === "interview").length,
      description: "Interview preparation and techniques",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Skill",
      icon: Code,
      count: tips.filter((t) => t.category === "skill").length,
      description: "Technical skill development",
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Networking",
      icon: Users,
      count: tips.filter((t) => t.category === "networking").length,
      description: "Building professional relationships",
      color: "bg-orange-100 text-orange-800",
    },
    {
      name: "Salary",
      icon: DollarSign,
      count: tips.filter((t) => t.category === "salary").length,
      description: "Compensation and negotiation",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Leadership",
      icon: Award,
      count: tips.filter((t) => t.category === "leadership").length,
      description: "Leadership and management skills",
      color: "bg-red-100 text-red-800",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-purple-100 text-purple-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case "trend":
        return "bg-blue-100 text-blue-800";
      case "opportunity":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTips = tips.filter((tip) => {
    const matchesCategory =
      selectedCategory === "all" || tip.category === selectedCategory;
    const matchesSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const sortedTips = [...filteredTips].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.confidence - a.confidence;
      case "popularity":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "recent":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return b.confidence - a.confidence;
    }
  });

  const bookmarkedTips = tips.filter((tip) => tip.isBookmarked);
  const likedTips = tips.filter((tip) => tip.isLiked);
  const highImpactTips = tips.filter((tip) => tip.impact === "high");

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
          <h1 className="text-3xl font-bold">AI Tips</h1>
          <p className="text-gray-600 mt-2">
            Personalized AI-powered career advice and professional development
            tips
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Tips
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Get New Tips
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tips</p>
                <p className="text-2xl font-bold">{tips.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookmarked</p>
                <p className="text-2xl font-bold">{bookmarkedTips.length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <Bookmark className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Impact</p>
                <p className="text-2xl font-bold">{highImpactTips.length}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Rocket className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Liked Tips</p>
                <p className="text-2xl font-bold">{likedTips.length}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-[10px]">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-[10px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{insight.title}</h3>
                  <Badge className={getInsightTypeColor(insight.type)}>
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {insight.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recommendations:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {insight.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="flex items-center">
                        <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Tip Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div
                  key={category.name}
                  className={`p-4 border rounded-[10px] cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === category.name.toLowerCase()
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setSelectedCategory(category.name.toLowerCase())
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <CategoryIcon className="w-5 h-5 text-gray-600" />
                    <Badge className={category.color}>{category.count}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="popularity">Sort by Popularity</option>
              <option value="likes">Sort by Likes</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedTips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>

      {sortedTips.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tips found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all categories.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TipCard({ tip }: { tip: AITip }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-purple-100 text-purple-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
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
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
              <p className="text-gray-600 text-sm">{tip.description}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Badge className={getDifficultyColor(tip.difficulty)}>
                {tip.difficulty}
              </Badge>
              <Badge className={getImpactColor(tip.impact)}>
                {tip.impact} impact
              </Badge>
            </div>
          </div>

          {/* Content Preview */}
          <p className="text-gray-600 text-sm line-clamp-3">{tip.content}</p>

          {/* AI Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>AI Confidence:</span>
              <span className="font-medium">{tip.confidence}%</span>
            </div>
            <Progress value={tip.confidence} className="h-2" />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Time:</span>
              <span className="ml-2 font-medium">{tip.timeToImplement}</span>
            </div>
            <div>
              <span className="text-gray-600">Views:</span>
              <span className="ml-2 font-medium">{tip.views}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tip.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tip.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tip.tags.length - 3} more
              </Badge>
            )}
          </div>

          {/* Resources */}
          {tip.resources.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Resources:</p>
              <div className="space-y-1">
                {tip.resources.slice(0, 2).map((resource, index) => (
                  <div
                    key={index}
                    className="text-sm text-blue-600 flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    {resource.title}
                  </div>
                ))}
                {tip.resources.length > 2 && (
                  <p className="text-sm text-gray-500">
                    +{tip.resources.length - 2} more resources
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Read More
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className={tip.isBookmarked ? "text-blue-600" : ""}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={tip.isLiked ? "text-red-600" : ""}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
