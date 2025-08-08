"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Download,
  Eye,
  Star,
  TrendingUp,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  Edit,
  RefreshCw,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface Review {
  id: string;
  documentName: string;
  documentType: "cv" | "academic" | "portfolio" | "certificate" | "other";
  reviewer: {
    name: string;
    avatar?: string;
    title: string;
    rating: number;
  };
  submittedDate: string;
  status: "pending" | "in-review" | "completed" | "rejected";
  priority: "low" | "medium" | "high";
  estimatedCompletion?: string;
  actualCompletion?: string;
  feedback?: string;
  score?: number;
  comments: ReviewComment[];
  attachments?: string[];
}

interface ReviewComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: "feedback" | "question" | "clarification";
}

export default function TrackReviewPage() {
  const { userData } = useRole();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockReviews: Review[] = [
      {
        id: "1",
        documentName: "Resume_2024.pdf",
        documentType: "cv",
        reviewer: {
          name: "Dr. Sarah Johnson",
          avatar: "/assets/team/Dr-Godbless-Akaighe.png",
          title: "Senior Career Advisor",
          rating: 4.8,
        },
        submittedDate: "2024-01-15",
        status: "completed",
        priority: "high",
        estimatedCompletion: "2024-01-18",
        actualCompletion: "2024-01-17",
        feedback:
          "Excellent resume structure! Consider adding more quantifiable achievements and updating the skills section to match current industry trends.",
        score: 85,
        comments: [
          {
            id: "c1",
            author: "Dr. Sarah Johnson",
            content:
              "Great work on the experience section. Consider adding metrics to demonstrate impact.",
            timestamp: "2024-01-17T10:30:00Z",
            type: "feedback",
          },
          {
            id: "c2",
            author: "You",
            content:
              "Thank you for the feedback! I'll update the metrics section.",
            timestamp: "2024-01-17T14:20:00Z",
            type: "clarification",
          },
        ],
        attachments: ["resume_feedback.pdf"],
      },
      {
        id: "2",
        documentName: "Academic_Transcript.pdf",
        documentType: "academic",
        reviewer: {
          name: "Prof. Michael Chen",
          avatar: "/assets/team/developer.avif",
          title: "Academic Review Specialist",
          rating: 4.6,
        },
        submittedDate: "2024-01-20",
        status: "in-review",
        priority: "medium",
        estimatedCompletion: "2024-01-25",
        comments: [
          {
            id: "c3",
            author: "Prof. Michael Chen",
            content:
              "Reviewing your academic credentials. Will provide detailed feedback on course selection and GPA analysis.",
            timestamp: "2024-01-21T09:15:00Z",
            type: "feedback",
          },
        ],
      },
      {
        id: "3",
        documentName: "Project_Portfolio.zip",
        documentType: "portfolio",
        reviewer: {
          name: "Emily Rodriguez",
          title: "Portfolio Specialist",
          rating: 4.7,
        },
        submittedDate: "2024-01-18",
        status: "pending",
        priority: "low",
        estimatedCompletion: "2024-01-28",
        comments: [],
      },
      {
        id: "4",
        documentName: "AWS_Certification.pdf",
        documentType: "certificate",
        reviewer: {
          name: "David Kim",
          avatar: "/assets/team/Maria.webp",
          title: "Certification Validator",
          rating: 4.5,
        },
        submittedDate: "2024-01-10",
        status: "completed",
        priority: "medium",
        estimatedCompletion: "2024-01-12",
        actualCompletion: "2024-01-11",
        feedback:
          "Certificate verified successfully. Valid AWS Solutions Architect Associate certification. Consider pursuing advanced certifications.",
        score: 92,
        comments: [
          {
            id: "c4",
            author: "David Kim",
            content:
              "Certificate is authentic and up-to-date. Great choice for cloud computing career path.",
            timestamp: "2024-01-11T16:45:00Z",
            type: "feedback",
          },
        ],
      },
      {
        id: "5",
        documentName: "Cover_Letter.pdf",
        documentType: "other",
        reviewer: {
          name: "Lisa Thompson",
          title: "Communication Specialist",
          rating: 4.4,
        },
        submittedDate: "2024-01-22",
        status: "rejected",
        priority: "high",
        estimatedCompletion: "2024-01-24",
        actualCompletion: "2024-01-23",
        feedback:
          "Cover letter needs significant improvement. Grammar issues and lack of specific examples. Please revise and resubmit.",
        score: 45,
        comments: [
          {
            id: "c5",
            author: "Lisa Thompson",
            content:
              "Please address the grammar issues and add specific examples of your achievements.",
            timestamp: "2024-01-23T11:20:00Z",
            type: "feedback",
          },
        ],
      },
    ];

    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-review":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-review":
        return Clock;
      case "pending":
        return AlertCircle;
      case "rejected":
        return AlertCircle;
      default:
        return FileText;
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

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "cv":
        return "FileText";
      case "academic":
        return "BookOpen";
      case "portfolio":
        return "FolderOpen";
      case "certificate":
        return "Award";
      case "other":
        return "File";
      default:
        return "FileText";
    }
  };

  const pendingReviews = reviews.filter(
    (review) => review.status === "pending"
  );
  const inReviewReviews = reviews.filter(
    (review) => review.status === "in-review"
  );
  const completedReviews = reviews.filter(
    (review) => review.status === "completed"
  );
  const rejectedReviews = reviews.filter(
    (review) => review.status === "rejected"
  );

  const averageScore =
    completedReviews.length > 0
      ? Math.round(
          completedReviews.reduce(
            (sum, review) => sum + (review.score || 0),
            0
          ) / completedReviews.length
        )
      : 0;

  const totalReviews = reviews.length;
  const completedCount = completedReviews.length;

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Track Review</h1>
          <p className="text-gray-600 mt-2">
            Monitor the progress of your document reviews and feedback
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold">{totalReviews}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
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
                  {inReviewReviews.length + pendingReviews.length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reviews ({totalReviews})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="in-review">
            In Review ({inReviewReviews.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Pending Reviews
                </h3>
                <p className="text-gray-600">
                  All your documents are being processed or have been completed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-review" className="space-y-6">
          {inReviewReviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Reviews in Progress
                </h3>
                <p className="text-gray-600">
                  No documents are currently being reviewed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inReviewReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedReviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Completed Reviews
                </h3>
                <p className="text-gray-600">
                  Your completed reviews will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-6">
          {rejectedReviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Rejected Reviews
                </h3>
                <p className="text-gray-600">
                  Great! No reviews have been rejected.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rejectedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-review":
        return Clock;
      case "pending":
        return AlertCircle;
      case "rejected":
        return AlertCircle;
      default:
        return FileText;
    }
  };

  const StatusIcon = getStatusIcon(review.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-review":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-[10px]">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{review.documentName}</CardTitle>
              <p className="text-sm text-gray-600 capitalize">
                {review.documentType}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(review.priority)}>
              {review.priority}
            </Badge>
            <Badge className={getStatusColor(review.status)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {review.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Reviewer Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.reviewer.avatar} />
              <AvatarFallback>
                {review.reviewer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{review.reviewer.name}</p>
              <p className="text-sm text-gray-600">{review.reviewer.title}</p>
              <div className="flex items-center text-sm">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                {review.reviewer.rating}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Submitted:</span>
              <span>{new Date(review.submittedDate).toLocaleDateString()}</span>
            </div>
            {review.estimatedCompletion && (
              <div className="flex items-center justify-between text-sm">
                <span>Estimated Completion:</span>
                <span>
                  {new Date(review.estimatedCompletion).toLocaleDateString()}
                </span>
              </div>
            )}
            {review.actualCompletion && (
              <div className="flex items-center justify-between text-sm">
                <span>Completed:</span>
                <span>
                  {new Date(review.actualCompletion).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Score */}
          {review.score && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Score:</span>
                <span className="font-medium">{review.score}%</span>
              </div>
              <Progress value={review.score} className="h-2" />
            </div>
          )}

          {/* Feedback */}
          {review.feedback && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Feedback:</p>
              <p className="text-sm text-gray-600">{review.feedback}</p>
            </div>
          )}

          {/* Comments */}
          {review.comments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Comments ({review.comments.length})
              </p>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {review.comments.slice(0, 2).map((comment) => (
                  <div
                    key={comment.id}
                    className="text-xs bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                ))}
                {review.comments.length > 2 && (
                  <p className="text-xs text-blue-600">
                    +{review.comments.length - 2} more comments
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button size="sm" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            {review.attachments && review.attachments.length > 0 && (
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            {review.status === "rejected" && (
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Resubmit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
