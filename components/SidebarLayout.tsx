"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  Home,
  FileText,
  Users,
  Shield,
  RefreshCw,
  ChevronsUpDown,
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { UserNav } from "./UserNav";
import { dashboardSidebarConfig } from "@/components/dashboardSidebarConfig";
import Image from "next/image";
import { useRole } from "@/contexts/RoleContext";
import { getApiRequest, postApiRequest, logoutUser } from "@/lib/apiFetch";
import {
  deleteRefreshTokenFromCookies,
  deleteTokenFromCookies,
  getTokenFromCookies,
} from "@/lib/cookies";

type DashboardRole = keyof typeof dashboardSidebarConfig;

interface SidebarSection {
  title: string;
  items: {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
  }[];
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userData, getActiveRole, switchUserRole, setUserData, setUserRole } =
    useRole();
  const router = useRouter();
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentActiveRole, setCurrentActiveRole] = useState<any>(null);

  const isActiveRoute = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const userRole = userData?.role || "student"; // fallback

  const role = (userRole || "student") as DashboardRole;
  const dashboardData = dashboardSidebarConfig[role];

  let menuSections: SidebarSection[] = [];

  if (dashboardData && "sections" in dashboardData) {
    menuSections = dashboardData.sections;
  } else if (dashboardData && "getSections" in dashboardData) {
    // teamTechProfessional is always an admin
    const isAdmin = userRole === "teamTechProfessional";
    menuSections = dashboardData.getSections(isAdmin);
  } else {
    menuSections = [];
  }

  // Fetch available roles for the user
  const fetchAvailableRoles = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      const response = await getApiRequest(
        "/api/users/available-roles",
        token || undefined
      );

      if (response.data?.success) {
        setAvailableRoles(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch available roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get current active role
  const getCurrentActiveRole = async () => {
    try {
      const token = getTokenFromCookies();
      const response = await getApiRequest(
        "/api/users/active-role",
        token || undefined
      );

      if (response.data?.success) {
        setCurrentActiveRole(response.data.data);
      }
    } catch (error) {
      console.error("Failed to get active role:", error);
    }
  };

  // Handle role switching
  const handleRoleSwitch = async (roleId: string) => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      const response = await postApiRequest(
        "/api/users/switch-role",
        { roleId },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data?.success) {
        // Update the user data with new role
        const newUserData = { ...userData, role: response.data.data.role };
        setUserData(newUserData);
        setUserRole(response.data.data.role);

        // Refresh the page to update sidebar menu
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to switch role:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles when component mounts for tech professionals
  useEffect(() => {
    if (
      userData?.role === "individualTechProfessional" ||
      userData?.role === "teamTechProfessional"
    ) {
      fetchAvailableRoles();
      getCurrentActiveRole();
    }
  }, [userData?.role]);

  const logoutHandler = async () => {
    try {
      await logoutUser(); // Your existing helper
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      deleteTokenFromCookies();
      deleteRefreshTokenFromCookies();
      router.push("/login");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/techedusolution.jpg"
                alt="techedu solution logo"
                width={40}
                height={40}
                className="rounded-[5px]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">TechEdu Solution</span>
                <span className="text-xs text-muted-foreground">
                  {dashboardData?.displayName || "Dashboard"}
                </span>
              </div>
            </div>
            {/* Role Management Dropdown - Only show for tech professionals */}
            {(userData?.role === "individualTechProfessional" ||
              userData?.role === "teamTechProfessional") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-start gap-2 justify-start"
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                    <span>Switch Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-white rounded-[10px]"
                  align="start"
                >
                  <DropdownMenuLabel>
                    {loading ? "Loading..." : "Available Roles"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Current Active Role */}
                  {currentActiveRole && (
                    <>
                      <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                        Current:{" "}
                        {currentActiveRole.role || currentActiveRole.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* Available Roles List */}
                  {availableRoles.length > 0 ? (
                    availableRoles.map((role) => (
                      <DropdownMenuItem
                        key={role._id || role.id}
                        onClick={() => handleRoleSwitch(role._id || role.id)}
                        className="flex items-center justify-between"
                        disabled={loading}
                      >
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          <span>{role.role || role.name}</span>
                        </div>
                        {currentActiveRole &&
                          (currentActiveRole._id === role._id ||
                            currentActiveRole.id === role.id) && (
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          )}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      <span className="text-gray-500">No roles available</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={fetchAvailableRoles}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    <span>Refresh Roles</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarHeader>

          <SidebarContent>
            {menuSections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item: any) => {
                      const Icon = item.icon;
                      const active = isActiveRoute(item.href);
                      return (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={item.label}
                          >
                            <Link href={item.href}>
                              <Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-border py-4 flex flex-col gap-2">
            <Link href="/dashboard/settings">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 justify-start"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>

            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userData?.avatar}
                  alt={userData?.fullName || "User"}
                />
                <AvatarFallback>
                  {userData?.fullName
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm min-w-0 flex-1 max-w-[160px]">
                <div className="flex items-center gap-1">
                  <span className="font-medium truncate">
                    {userData.fullName}
                  </span>
                  {userData?.role === "teamTechProfessional" && (
                    <div title="Team Admin">
                      <Shield className="h-3 w-3 text-green-600" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {userData.email}
                </span>
                {userData?.role === "teamTechProfessional" && (
                  <span className="text-xs text-green-600 font-medium">
                    Team Admin
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center bg-blue-600 hover:bg-blue-400 text-white hover:text-white rounded-[10px] gap-2 justify-start"
              onClick={logoutHandler}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <SidebarInset>
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-md flex h-[3.5rem] items-center gap-2 px-4 border-b rounded-[10px]">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-lg font-semibold px-4">Dashboard</h1>
              <div className="ml-auto flex items-center space-x-4">
                <NotificationBell />
                <UserNav />
              </div>
            </header>
            <main className="p-6 w-full min-w-0 max-w-full overflow-hidden">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
