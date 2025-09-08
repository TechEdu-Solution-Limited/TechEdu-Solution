"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCheck, Trash2, RefreshCw } from "lucide-react";
import {
  getApiRequest,
  patchApiRequest,
  deleteApiRequest,
} from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";

import { safeConsole } from "@/lib/console";
const NOTIFICATION_TYPES = [
  { label: "All Types", value: "" },
  { label: "Payment Success", value: "payment_success" },
  { label: "Team Invitation", value: "team_invitation" },
  { label: "Booking Confirmation", value: "booking_confirmation" },
  { label: "Session Reminder", value: "session_reminder" },
  { label: "Classroom Update", value: "classroom_update" },
  { label: "Payment Reminder", value: "payment_reminder" },
  { label: "System Alert", value: "system_alert" },
];

function NotificationsPage() {
  const { userRole } = useRole();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [unreadCount, setUnreadCount] = useState(0);
  const [type, setType] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Get token from cookie (client-side only)
  const token =
    typeof window !== "undefined"
      ? decodeURIComponent(getCookie("token") || "")
      : undefined;

  // Fetch notifications
  const fetchNotifications = async (
    page = 1,
    limit = 20,
    unread = false,
    typeFilter = ""
  ) => {
    setLoading(true);
    try {
      // safeConsole.log("Fetching notifications with:", {
      //   page,
      //   limit,
      //   unread,
      //   typeFilter,
      // });
      let res;
      if (typeFilter && typeFilter !== "") {
        res = await getApiRequest(
          `/api/notifications/type/${typeFilter}?page=${page}&limit=${limit}`,
          token
        );
      } else if (unread) {
        // Only add unreadOnly filter when explicitly requested
        res = await getApiRequest(
          `/api/notifications?page=${page}&limit=${limit}&unreadOnly=true`,
          token
        );
      } else {
        // Default: no filters, just pagination - this is what runs on mount
        res = await getApiRequest(
          `/api/notifications?page=${page}&limit=${limit}`,
          token
        );
      }
      // safeConsole.log("Notifications response:", res);
      setNotifications(res.data?.data?.notifications || []);
      // safeConsole.log("Notifications:", res.data?.data?.notifications);
      setPagination(
        res.data?.data?.pagination || { page: 1, limit: 20, total: 0, pages: 1 }
      );
    } catch (error) {
      // safeConsole.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const res = await getApiRequest("/api/notifications/unread-count", token);
      if (res?.data?.data?.unreadCount !== undefined) {
        setUnreadCount(res.data.data.unreadCount);
      }
    } catch (error) {
      // safeConsole.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  // Fetch notifications on component mount - no filters
  useEffect(() => {
    fetchNotifications(1, 20, false, "");
  }, []);

  // Fetch notifications when filters change
  useEffect(() => {
    if (pagination.page > 1 || pagination.limit !== 20 || unreadOnly || type) {
      fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    }
  }, [pagination.page, pagination.limit, unreadOnly, type]);

  useEffect(() => {
    fetchUnreadCount();
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    await patchApiRequest("/api/notifications/mark-all-read", token || "", {});
    fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    fetchUnreadCount();
  };

  const handleClearAll = async () => {
    await deleteApiRequest("/api/notifications", token || "");
    fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    fetchUnreadCount();
  };

  const handleMarkAsRead = async (id: string) => {
    await patchApiRequest(`/api/notifications/${id}/read`, token || "", {});
    fetchNotifications(pagination.page, pagination.limit, unreadOnly, type);
    fetchUnreadCount();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(
      pagination.page,
      pagination.limit,
      unreadOnly,
      type
    );
    await fetchUnreadCount();
    setRefreshing(false);
  };

  const unreadNotifications = useMemo(
    () => notifications.filter((n: any) => !n.isRead),
    [notifications]
  );

  // Add role-based filtering for Institution
  const institutionNotifications = useMemo(
    () =>
      notifications.filter(
        (n: any) => n.role === "institution" || n.audience === "institution"
      ),
    [notifications]
  );

  // Pagination controls
  const handlePrevPage = () => {
    if (pagination.page > 1) setPagination((p) => ({ ...p, page: p.page - 1 }));
  };
  const handleNextPage = () => {
    if (pagination.page < pagination.pages)
      setPagination((p) => ({ ...p, page: p.page + 1 }));
  };

  // Type filter
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setPagination((p) => ({ ...p, page: 1 })); // Reset to first page on type change
  };

  // Helper function to get notification type labels
  const getNotificationTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      payment_success: "Payment Success",
      team_invitation: "Team Invitation",
      booking_confirmation: "Booking Confirmation",
      session_reminder: "Session Reminder",
      classroom_update: "Classroom Update",
      payment_reminder: "Payment Reminder",
      system_alert: "System Alert",
    };
    return (
      typeLabels[type] ||
      type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
    );
  };

  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_success":
        return "💰";
      case "team_invitation":
        return "👥";
      case "booking_confirmation":
        return "📅";
      case "session_reminder":
        return "⏰";
      case "classroom_update":
        return "🎓";
      case "payment_reminder":
        return "💳";
      case "system_alert":
        return "⚠️";
      default:
        return "📢";
    }
  };

  const NotificationItem = ({ notification }: { notification: any }) => (
    <div
      onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
      style={{ cursor: "pointer" }}
    >
      <div className="flex flex-wrap items-start gap-4 p-4 rounded-[10px] hover:bg-gray-50 transition-colors border-b">
        {!notification.isRead && (
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
        )}
        <div className={`flex-1 ${notification.isRead ? "ml-[26px]" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">
              {getNotificationIcon(notification.type)}
            </span>
            <h4 className="font-semibold text-base sm:text-lg break-words">
              {notification.title}
            </h4>
          </div>
          <p className="text-sm text-gray-600 break-words">
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
            {notification.sentAt && (
              <span>
                Sent: {new Date(notification.sentAt).toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {notification.type && (
              <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                {getNotificationTypeLabel(notification.type)}
              </span>
            )}
            {notification.deliveryChannel &&
              notification.deliveryChannel.length > 0 && (
                <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                  {notification.deliveryChannel.join(", ")}
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount} unread
              </span>
            )}
            {notifications.length > 0 && (
              <span className="ml-2 bg-gray-600 text-white text-xs rounded-full px-2 py-0.5">
                {notifications.length} total
              </span>
            )}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="text-sm text-gray-600">
            {loading ? "Loading..." : `${notifications.length} notifications`}
          </div>
          <select
            className="border rounded-[10px] px-3 py-2 text-sm"
            value={type}
            onChange={handleTypeChange}
            style={{ minWidth: 160 }}
          >
            {NOTIFICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      <Card className="px-2 sm:px-6">
        <CardHeader>
          <Tabs
            defaultValue={unreadOnly ? "unread" : "all"}
            onValueChange={(val) => setUnreadOnly(val === "unread")}
          >
            <TabsList>
              <TabsTrigger className="rounded-[10px]" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="rounded-[10px]" value="unread">
                Unread{" "}
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              {userRole === "institution" && (
                <TabsTrigger className="rounded-[10px]" value="institution">
                  Institution Only
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="all">
              <div className="mt-4">
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
                    <p>Loading notifications...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <NotificationItem key={n._id} notification={n} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No notifications found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {loading
                        ? "Loading..."
                        : "You're all caught up! No new notifications at the moment."}
                    </p>
                    {!loading && (
                      <p className="mt-2 text-xs text-gray-400">
                        Notifications will appear here when you have updates
                        about payments, bookings, sessions, and more.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="unread">
              <div className="mt-4">
                {loading ? (
                  <div className="text-center py-12 text-gray-500">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
                    <p>Loading notifications...</p>
                  </div>
                ) : unreadNotifications.length > 0 ? (
                  unreadNotifications.map((n: any) => (
                    <NotificationItem key={n._id} notification={n} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No unread notifications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            {userRole === "institution" && (
              <TabsContent value="institution">
                <div className="mt-4">
                  {loading ? (
                    <div className="text-center py-12 text-gray-500">
                      <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
                      <p>Loading notifications...</p>
                    </div>
                  ) : institutionNotifications.length > 0 ? (
                    institutionNotifications.map((n: any) => (
                      <NotificationItem key={n._id} notification={n} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No institution notifications
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardHeader>
      </Card>
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={pagination.page === pagination.pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default NotificationsPage;
