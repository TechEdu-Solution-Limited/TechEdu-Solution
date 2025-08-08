"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Users,
  FileText,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { getCookie } from "@/lib/cookies";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "active" | "inactive" | "expired";
  usageCount: number;
  maxUsage: number;
  lastUsed?: string;
  rating?: number;
  icon: string;
}

interface ServiceCategory {
  name: string;
  services: Service[];
  totalUsage: number;
  maxUsage: number;
}

export default function ServiceAccessPage() {
  const { userData } = useRole();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockServices: Service[] = [
      {
        id: "1",
        name: "Academic Coaching",
        category: "Academic Support",
        description: "One-on-one academic guidance and study planning",
        status: "active",
        usageCount: 3,
        maxUsage: 10,
        lastUsed: "2024-01-15",
        rating: 4.8,
        icon: "BookOpen",
      },
      {
        id: "2",
        name: "CV Review",
        category: "Career Development",
        description: "Professional CV review and feedback",
        status: "active",
        usageCount: 1,
        maxUsage: 3,
        lastUsed: "2024-01-10",
        rating: 4.9,
        icon: "FileText",
      },
      {
        id: "3",
        name: "Mentorship Sessions",
        category: "Career Development",
        description: "Connect with industry professionals",
        status: "active",
        usageCount: 2,
        maxUsage: 5,
        lastUsed: "2024-01-12",
        rating: 4.7,
        icon: "Users",
      },
      {
        id: "4",
        name: "Skill Assessment",
        category: "Assessment",
        description: "Comprehensive skill evaluation and recommendations",
        status: "inactive",
        usageCount: 0,
        maxUsage: 2,
        rating: 4.6,
        icon: "Target",
      },
      {
        id: "5",
        name: "Interview Preparation",
        category: "Career Development",
        description: "Mock interviews and feedback",
        status: "active",
        usageCount: 0,
        maxUsage: 4,
        rating: 4.8,
        icon: "Calendar",
      },
    ];

    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const getServiceIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      BookOpen,
      Users,
      FileText,
      Target,
      Calendar,
    };
    return icons[iconName] || BookOpen;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = services.reduce((acc: ServiceCategory[], service) => {
    const existingCategory = acc.find((cat) => cat.name === service.category);
    if (existingCategory) {
      existingCategory.services.push(service);
      existingCategory.totalUsage += service.usageCount;
      existingCategory.maxUsage += service.maxUsage;
    } else {
      acc.push({
        name: service.category,
        services: [service],
        totalUsage: service.usageCount,
        maxUsage: service.maxUsage,
      });
    }
    return acc;
  }, []);

  const totalUsage = services.reduce(
    (sum, service) => sum + service.usageCount,
    0
  );
  const totalMaxUsage = services.reduce(
    (sum, service) => sum + service.maxUsage,
    0
  );
  const activeServices = services.filter(
    (service) => service.status === "active"
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h1 className="text-3xl font-bold">Service Access Summary</h1>
          <p className="text-gray-600 mt-2">
            Overview of your available services and usage statistics
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          View History
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Services
                </p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Services
                </p>
                <p className="text-2xl font-bold">{activeServices}</p>
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
                <p className="text-sm font-medium text-gray-600">Usage Rate</p>
                <p className="text-2xl font-bold">
                  {totalMaxUsage > 0
                    ? Math.round((totalUsage / totalMaxUsage) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold">
                  {services.filter((s) => s.rating).length > 0
                    ? (
                        services.reduce((sum, s) => sum + (s.rating || 0), 0) /
                        services.filter((s) => s.rating).length
                      ).toFixed(1)
                    : "N/A"}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Services ({services.length})
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.name.toLowerCase()}
            >
              {category.name} ({category.services.length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-[10px]">
                        {(() => {
                          const IconComponent = getServiceIcon(service.icon);
                          return (
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          );
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {service.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {service.category}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Usage Progress</span>
                      <span>
                        {service.usageCount}/{service.maxUsage}
                      </span>
                    </div>
                    <Progress
                      value={(service.usageCount / service.maxUsage) * 100}
                      className="h-2"
                    />

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.lastUsed
                          ? `Last used: ${new Date(
                              service.lastUsed
                            ).toLocaleDateString()}`
                          : "Not used yet"}
                      </div>
                      {service.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {service.rating}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Use Service
                    </Button>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent
            key={category.name}
            value={category.name.toLowerCase()}
            className="space-y-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {category.name} Overview
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  Total Usage: {category.totalUsage}/{category.maxUsage}
                </span>
                <span>Services: {category.services.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.services.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-[10px]">
                          {(() => {
                            const IconComponent = getServiceIcon(service.icon);
                            return (
                              <IconComponent className="w-5 h-5 text-blue-600" />
                            );
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {service.category}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Usage Progress</span>
                        <span>
                          {service.usageCount}/{service.maxUsage}
                        </span>
                      </div>
                      <Progress
                        value={(service.usageCount / service.maxUsage) * 100}
                        className="h-2"
                      />

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.lastUsed
                            ? `Last used: ${new Date(
                                service.lastUsed
                              ).toLocaleDateString()}`
                            : "Not used yet"}
                        </div>
                        {service.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {service.rating}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Use Service
                      </Button>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
