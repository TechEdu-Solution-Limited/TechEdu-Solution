// types/sidebar.ts
import { LucideIcon } from "lucide-react";

export interface SidebarMenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
  adminOnly?: boolean;
}

export interface SidebarSection {
  title: string;
  items: SidebarMenuItem[];
}

export interface DashboardSidebarConfig {
  displayName: string;
  sections: SidebarSection[];
  getSections?: (isAdmin: boolean) => SidebarSection[];
}
