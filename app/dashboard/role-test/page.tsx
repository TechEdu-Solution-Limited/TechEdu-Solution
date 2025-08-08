"use client";

import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Shield, User, Users } from "lucide-react";
import { toast } from "react-toastify";

export default function RoleTestPage() {
  const { userData, userRole, getActiveRole, switchUserRole } = useRole();
  const [loading, setLoading] = useState(false);

  const handleGetActiveRole = async () => {
    setLoading(true);
    try {
      console.log("[RoleTestPage] Getting active role...");
      await getActiveRole();
      toast.success("Active role refreshed! Check console for details.");
    } catch (error) {
      console.error("[RoleTestPage] Error getting active role:", error);
      toast.error("Failed to get active role");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchRole = async () => {
    setLoading(true);
    try {
      console.log("[RoleTestPage] Switching role...");
      await switchUserRole();
      toast.success("Role switched! Check console for details.");
    } catch (error) {
      console.error("[RoleTestPage] Error switching role:", error);
      toast.error("Failed to switch role");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "individualTechProfessional":
        return <User className="w-4 h-4" />;
      case "teamTechProfessional":
        return <Users className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "individualTechProfessional":
        return "Individual Tech Professional";
      case "teamTechProfessional":
        return "Team Tech Professional";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management Test</h1>
          <p className="text-gray-600 mt-2">
            Test the role switching functionality and view console logs
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Role Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Current Role
            </CardTitle>
            <CardDescription>
              Your current active role in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {getRoleIcon(userRole)}
              <div>
                <div className="font-semibold">
                  {getRoleDisplayName(userRole)}
                </div>
                <div className="text-sm text-gray-500">{userRole}</div>
              </div>
              <Badge variant="secondary">{userData?.role}</Badge>
            </div>

            <div className="text-sm text-gray-600">
              <div>
                <strong>User:</strong> {userData?.fullName}
              </div>
              <div>
                <strong>Email:</strong> {userData?.email}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Role Actions
            </CardTitle>
            <CardDescription>
              Manage your role and view backend responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGetActiveRole}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {loading ? "Loading..." : "Get Active Role"}
            </Button>

            {(userRole === "individualTechProfessional" ||
              userRole === "teamTechProfessional") && (
              <Button
                onClick={handleSwitchRole}
                disabled={loading}
                className="w-full"
                variant="default"
              >
                <Shield className="w-4 h-4 mr-2" />
                {loading ? "Switching..." : "Switch Role"}
              </Button>
            )}

            <div className="text-xs text-gray-500 mt-4">
              💡 Check the browser console to see detailed API responses
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Info */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Backend endpoints being tested</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">GET</Badge>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                /api/users/active-role
              </code>
              <span className="text-sm text-gray-600">
                Get user's current active role
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">POST</Badge>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                /api/users/switch-role
              </code>
              <span className="text-sm text-gray-600">
                Switch between individual and team tech professional
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
