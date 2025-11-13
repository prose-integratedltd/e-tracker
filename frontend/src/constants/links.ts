import {
	DashboardIcon,
	EmailIcon,
	JobsIcon,
	SettingsIcon,
	UsersIcon,
} from "@/app/component/common/SidebarIcons";

export interface DashboardLink {
	name: string;
	href: string;
	icon: React.FC;
}

export const dashboardLinks: DashboardLink[] = [
	{
		name: "Dashboard",
		href: "/dashboard",
		icon: DashboardIcon,
	},
	{
		name: "Jobs",
		href: "/jobs",
		icon: JobsIcon,
	},
	{
		name: "Email Template",
		href: "/email-template",
		icon: EmailIcon,
	},
	{
		name: "Users",
		href: "/users",
		icon: UsersIcon,
	},
	{
		name: "Settings",
		href: "/settings",
		icon: SettingsIcon,
	},
];