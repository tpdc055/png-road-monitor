"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CommunityFeedback } from "@/types/connectpng";
import {
  AlertTriangle,
  BarChart3,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Flag,
  Mail,
  MapPin,
  MessageSquare,
  Mic,
  Phone,
  Plus,
  Search,
  Send,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Upload,
  User,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface CommunityFeedbackSystemProps {
  userRole?: string;
  userId?: string;
  projectId?: string;
}

// Feedback categories with descriptions
const FEEDBACK_CATEGORIES = {
  CONSTRUCTION_QUALITY: {
    label: "Construction Quality",
    description:
      "Issues with workmanship, materials, or construction standards",
    icon: Building,
    color: "bg-blue-100 text-blue-800",
  },
  ENVIRONMENTAL_IMPACT: {
    label: "Environmental Impact",
    description: "Environmental concerns, pollution, or ecological damage",
    icon: AlertTriangle,
    color: "bg-green-100 text-green-800",
  },
  SOCIAL_IMPACT: {
    label: "Social Impact",
    description: "Effects on community life, culture, or social structures",
    icon: Users,
    color: "bg-purple-100 text-purple-800",
  },
  ECONOMIC_IMPACT: {
    label: "Economic Impact",
    description: "Impact on local economy, employment, or livelihoods",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-800",
  },
  ACCESS: {
    label: "Access & Mobility",
    description: "Issues with road access, traffic, or transportation",
    icon: MapPin,
    color: "bg-indigo-100 text-indigo-800",
  },
  SAFETY: {
    label: "Safety & Security",
    description: "Safety hazards, security concerns, or accident risks",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800",
  },
};

const FEEDBACK_TYPES = {
  COMPLAINT: {
    label: "Complaint",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
  },
  SUGGESTION: {
    label: "Suggestion",
    color: "bg-blue-100 text-blue-800",
    icon: MessageSquare,
  },
  COMPLIMENT: {
    label: "Compliment",
    color: "bg-green-100 text-green-800",
    icon: ThumbsUp,
  },
  CONCERN: {
    label: "Concern",
    color: "bg-yellow-100 text-yellow-800",
    icon: Flag,
  },
  REQUEST: {
    label: "Request",
    color: "bg-purple-100 text-purple-800",
    icon: Plus,
  },
};

const SUBMITTER_TYPES = {
  COMMUNITY_MEMBER: "Community Member",
  LOCAL_LEADER: "Local Leader",
  BENEFICIARY: "Project Beneficiary",
  AFFECTED_PERSON: "Affected Person",
};

const PRIORITY_LEVELS = {
  LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
  MEDIUM: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgent", color: "bg-red-100 text-red-800" },
};

const STATUS_OPTIONS = {
  SUBMITTED: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800",
    icon: Send,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Eye,
  },
  INVESTIGATING: {
    label: "Investigating",
    color: "bg-orange-100 text-orange-800",
    icon: Search,
  },
  RESOLVED: {
    label: "Resolved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  CLOSED: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
  },
};

export default function CommunityFeedbackSystem({
  userRole = "COMMUNITY_LIAISON",
  userId,
  projectId,
}: CommunityFeedbackSystemProps) {
  const [feedbacks, setFeedbacks] = useState<CommunityFeedback[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<CommunityFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [feedbackForm, setFeedbackForm] = useState({
    projectId: projectId || "",
    submittedBy: "",
    submitterType: "COMMUNITY_MEMBER" as keyof typeof SUBMITTER_TYPES,
    feedbackType: "COMPLAINT" as keyof typeof FEEDBACK_TYPES,
    category: "CONSTRUCTION_QUALITY" as keyof typeof FEEDBACK_CATEGORIES,
    description: "",
    location: "",
    priority: "MEDIUM" as keyof typeof PRIORITY_LEVELS,
    contactPreference: "PHONE" as any,
    isAnonymous: false,
    phone: "",
    email: "",
    attachments: [] as File[],
  });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockFeedbacks: CommunityFeedback[] = [
        {
          id: "fb-001",
          projectId: "PNG-RD-001",
          submittedBy: "John Kaupa",
          submitterType: "COMMUNITY_MEMBER",
          feedbackType: "COMPLAINT",
          category: "CONSTRUCTION_QUALITY",
          description:
            "The road surface is developing cracks after only 2 months of completion. Water is pooling in these areas during rain.",
          priority: "HIGH",
          status: "UNDER_REVIEW",
          assignedTo: "Site Engineer - Mary Wilson",
          submissionDate: new Date("2024-12-01"),
          followUpRequired: true,
          contactPreference: "PHONE",
          isAnonymous: false,
          location: { latitude: -5.8536, longitude: 144.2302 },
        },
        {
          id: "fb-002",
          projectId: "PNG-RD-001",
          submittedBy: "Agnes Kila",
          submitterType: "LOCAL_LEADER",
          feedbackType: "SUGGESTION",
          category: "SAFETY",
          description:
            "We need better lighting along the road near the school area. Children walk this route early in the morning and evening.",
          priority: "MEDIUM",
          status: "INVESTIGATING",
          assignedTo: "Safety Officer - Peter Tom",
          submissionDate: new Date("2024-11-28"),
          followUpRequired: true,
          contactPreference: "EMAIL",
          isAnonymous: false,
        },
        {
          id: "fb-003",
          projectId: "PNG-RD-002",
          submittedBy: "Anonymous",
          submitterType: "AFFECTED_PERSON",
          feedbackType: "CONCERN",
          category: "ENVIRONMENTAL_IMPACT",
          description:
            "Construction activities have affected the water source in our village. The water is now muddy and not safe to drink.",
          priority: "URGENT",
          status: "SUBMITTED",
          submissionDate: new Date("2024-12-10"),
          followUpRequired: true,
          contactPreference: "IN_PERSON",
          isAnonymous: true,
        },
        {
          id: "fb-004",
          projectId: "PNG-RD-001",
          submittedBy: "Michael Bani",
          submitterType: "BENEFICIARY",
          feedbackType: "COMPLIMENT",
          category: "ECONOMIC_IMPACT",
          description:
            "The new road has greatly improved our access to the market. We can now transport our produce easily and get better prices.",
          priority: "LOW",
          status: "RESOLVED",
          resolution:
            "Feedback acknowledged and shared with project team. Positive impact documented for project reporting.",
          resolutionDate: new Date("2024-12-05"),
          submissionDate: new Date("2024-11-20"),
          followUpRequired: false,
          contactPreference: "SMS",
          isAnonymous: false,
        },
      ];
      setFeedbacks(mockFeedbacks);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const newFeedback: CommunityFeedback = {
        id: `fb-${Date.now()}`,
        projectId: feedbackForm.projectId,
        submittedBy: feedbackForm.isAnonymous
          ? "Anonymous"
          : feedbackForm.submittedBy,
        submitterType: feedbackForm.submitterType,
        feedbackType: feedbackForm.feedbackType,
        category: feedbackForm.category,
        description: feedbackForm.description,
        priority: feedbackForm.priority,
        status: "SUBMITTED",
        submissionDate: new Date(),
        followUpRequired: true,
        contactPreference: feedbackForm.contactPreference,
        isAnonymous: feedbackForm.isAnonymous,
      };

      setFeedbacks((prev) => [newFeedback, ...prev]);
      setShowSubmissionForm(false);
      resetForm();
      alert(
        "Thank you for your feedback! Your submission has been received and will be reviewed by our team.",
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  const resetForm = () => {
    setFeedbackForm({
      projectId: projectId || "",
      submittedBy: "",
      submitterType: "COMMUNITY_MEMBER",
      feedbackType: "COMPLAINT",
      category: "CONSTRUCTION_QUALITY",
      description: "",
      location: "",
      priority: "MEDIUM",
      contactPreference: "PHONE",
      isAnonymous: false,
      phone: "",
      email: "",
      attachments: [],
    });
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || feedback.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "ALL" || feedback.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFeedbackStats = () => {
    const stats = {
      total: feedbacks.length,
      byStatus: {
        submitted: feedbacks.filter((f) => f.status === "SUBMITTED").length,
        underReview: feedbacks.filter((f) => f.status === "UNDER_REVIEW")
          .length,
        investigating: feedbacks.filter((f) => f.status === "INVESTIGATING")
          .length,
        resolved: feedbacks.filter((f) => f.status === "RESOLVED").length,
        closed: feedbacks.filter((f) => f.status === "CLOSED").length,
      },
      byType: {
        complaints: feedbacks.filter((f) => f.feedbackType === "COMPLAINT")
          .length,
        suggestions: feedbacks.filter((f) => f.feedbackType === "SUGGESTION")
          .length,
        compliments: feedbacks.filter((f) => f.feedbackType === "COMPLIMENT")
          .length,
        concerns: feedbacks.filter((f) => f.feedbackType === "CONCERN").length,
        requests: feedbacks.filter((f) => f.feedbackType === "REQUEST").length,
      },
      byPriority: {
        urgent: feedbacks.filter((f) => f.priority === "URGENT").length,
        high: feedbacks.filter((f) => f.priority === "HIGH").length,
        medium: feedbacks.filter((f) => f.priority === "MEDIUM").length,
        low: feedbacks.filter((f) => f.priority === "LOW").length,
      },
    };
    return stats;
  };

  const stats = getFeedbackStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Community Feedback System
          </h1>
          <p className="text-gray-600 mt-1">
            Collect, manage, and respond to community feedback on Connect PNG
            projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Feedback
          </Button>
          <Button
            onClick={() => setShowSubmissionForm(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Submit Feedback
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Feedback</div>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.byStatus.submitted + stats.byStatus.underReview}
                </div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.byStatus.resolved}
                </div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.byPriority.urgent}
                </div>
                <div className="text-sm text-gray-600">Urgent Items</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="feedbacks" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            All Feedback
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="submit" className="gap-2">
            <Plus className="h-4 w-4" />
            Submit Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Feedback Type Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(FEEDBACK_TYPES).map(([key, type]) => {
              const count =
                stats.byType[key.toLowerCase() as keyof typeof stats.byType] ||
                0;
              const IconComponent = type.icon;
              return (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{count}</div>
                        <div className="text-sm text-gray-600">
                          {type.label}s
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                Latest community feedback submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbacks.slice(0, 5).map((feedback) => {
                  const statusInfo = STATUS_OPTIONS[feedback.status];
                  const categoryInfo = FEEDBACK_CATEGORIES[feedback.category];
                  const typeInfo = FEEDBACK_TYPES[feedback.feedbackType];
                  const priorityInfo = PRIORITY_LEVELS[feedback.priority];

                  return (
                    <div
                      key={feedback.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                        <typeInfo.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {feedback.submittedBy}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {feedback.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                              <Badge variant="outline">
                                {categoryInfo.label}
                              </Badge>
                              <Badge className={priorityInfo.color}>
                                {priorityInfo.label}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {feedback.submissionDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedbacks" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {Object.entries(FEEDBACK_CATEGORIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {Object.entries(STATUS_OPTIONS).map(([key, status]) => (
                  <SelectItem key={key} value={key}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => {
              const statusInfo = STATUS_OPTIONS[feedback.status];
              const categoryInfo = FEEDBACK_CATEGORIES[feedback.category];
              const typeInfo = FEEDBACK_TYPES[feedback.feedbackType];
              const priorityInfo = PRIORITY_LEVELS[feedback.priority];

              return (
                <Card
                  key={feedback.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          <Badge variant="outline">{categoryInfo.label}</Badge>
                          <Badge className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          {feedback.submittedBy} - {typeInfo.label}
                        </h3>
                        <p className="text-gray-700 mb-3">
                          {feedback.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {feedback.submissionDate.toLocaleDateString()}
                          </div>
                          {feedback.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {feedback.assignedTo}
                            </div>
                          )}
                          {feedback.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Location recorded
                            </div>
                          )}
                        </div>
                        {feedback.resolution && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="font-medium text-green-800 mb-1">
                              Resolution
                            </div>
                            <div className="text-green-700">
                              {feedback.resolution}
                            </div>
                            {feedback.resolutionDate && (
                              <div className="text-sm text-green-600 mt-1">
                                Resolved on{" "}
                                {feedback.resolutionDate.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {userRole !== "READ_only" && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feedback by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(FEEDBACK_CATEGORIES).map(
                    ([key, category]) => {
                      const count = feedbacks.filter(
                        (f) => f.category === key,
                      ).length;
                      const percentage =
                        feedbacks.length > 0
                          ? (count / feedbacks.length) * 100
                          : 0;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div className={`p-2 rounded ${category.color}`}>
                            <category.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                {category.label}
                              </span>
                              <span className="text-sm text-gray-600">
                                {count}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(STATUS_OPTIONS).map(([key, status]) => {
                    const count = feedbacks.filter(
                      (f) => f.status === key,
                    ).length;
                    const percentage =
                      feedbacks.length > 0
                        ? (count / feedbacks.length) * 100
                        : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className={`p-2 rounded ${status.color}`}>
                          <status.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{status.label}</span>
                            <span className="text-sm text-gray-600">
                              {count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit Community Feedback</CardTitle>
              <CardDescription>
                Share your feedback, concerns, or suggestions about Connect PNG
                projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="submitter-name">
                    Your Name {!feedbackForm.isAnonymous && "*"}
                  </Label>
                  <Input
                    id="submitter-name"
                    value={feedbackForm.submittedBy}
                    onChange={(e) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        submittedBy: e.target.value,
                      }))
                    }
                    placeholder="Enter your name"
                    disabled={feedbackForm.isAnonymous}
                  />
                </div>
                <div>
                  <Label htmlFor="submitter-type">I am a *</Label>
                  <Select
                    value={feedbackForm.submitterType}
                    onValueChange={(value) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        submitterType: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SUBMITTER_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feedback-type">Type of Feedback *</Label>
                  <Select
                    value={feedbackForm.feedbackType}
                    onValueChange={(value) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        feedbackType: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FEEDBACK_TYPES).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={feedbackForm.category}
                    onValueChange={(value) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        category: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FEEDBACK_CATEGORIES).map(
                        ([key, category]) => (
                          <SelectItem key={key} value={key}>
                            {category.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={feedbackForm.description}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Please describe your feedback in detail..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Select
                    value={feedbackForm.priority}
                    onValueChange={(value) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        priority: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_LEVELS).map(
                        ([key, priority]) => (
                          <SelectItem key={key} value={key}>
                            {priority.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact-preference">
                    Preferred Contact Method *
                  </Label>
                  <Select
                    value={feedbackForm.contactPreference}
                    onValueChange={(value) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        contactPreference: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHONE">Phone Call</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="SMS">SMS/Text Message</SelectItem>
                      <SelectItem value="IN_PERSON">
                        In-Person Meeting
                      </SelectItem>
                      <SelectItem value="COMMUNITY_MEETING">
                        Community Meeting
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={feedbackForm.isAnonymous}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      isAnonymous: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <Label htmlFor="anonymous">Submit feedback anonymously</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSubmitFeedback}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={
                    !feedbackForm.description ||
                    (!feedbackForm.isAnonymous && !feedbackForm.submittedBy)
                  }
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Clear Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
