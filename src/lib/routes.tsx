import { NavigationType } from "@/types/navigation-link";
import {
	BookCheck,
	ClipboardList,
	FileSearch,
	Files,
	GanttChart,
	GraduationCap,
	Route,
	Users2,
} from "lucide-react";
import {
	AiOutlineCalendar,
	AiOutlineFile,
	AiOutlineHome,
	AiOutlineInfoCircle,
	AiOutlineMessage,
	AiOutlineNotification,
} from "react-icons/ai";
import { cn } from "./utils";

const defaultNavLinkClassName = "h-4 w-4 3xl:w-5 3xl:h-5";

export const navlinks = [
	{
		title: "Courses",
		labelKey: "nav.courses",
		icon: <GraduationCap className={cn("", defaultNavLinkClassName)} />,
		href: "/courses",
		end: true,
		disabled: false,
	},
	{
		title: "Overview",
		labelKey: "nav.overview",
		icon: <GanttChart className={cn("", defaultNavLinkClassName)} />,
		href: "/overview",
		end: true,
		disabled: false,
	},
	{
		title: "Updates",
		labelKey: "nav.updates",
		icon: <BookCheck className={cn("", defaultNavLinkClassName)} />,
		href: "/updates",
		end: true,
		disabled: false,
	},
	{
		title: "All Tasks",
		labelKey: "nav.tasks",
		icon: <ClipboardList className={cn("", defaultNavLinkClassName)} />,
		href: "/all-tasks",
		end: true,
		disabled: false,
	},
	{
		title: "Calendar",
		labelKey: "nav.calendar",
		icon: <AiOutlineCalendar className={cn("", defaultNavLinkClassName)} />,
		href: "/calendar",
		end: true,
		disabled: false,
	},
	{
		title: "Messages",
		labelKey: "nav.messages",
		icon: <AiOutlineMessage className={cn("", defaultNavLinkClassName)} />,
		href: "/messages",
		end: true,
		disabled: false,
	},
	{
		title: "AI Chats",
		labelKey: "nav.aiChats",
		icon: <FileSearch className={cn("", defaultNavLinkClassName)} />,
		href: "/ai-chats",
		end: true,
		disabled: false,
	},
	{
		title: "Merge & ZIP",
		labelKey: "nav.mergeZip",
		icon: <AiOutlineFile className={cn("", defaultNavLinkClassName)} />,
		href: "/merge-zip-documents",
		end: true,
		disabled: false,
	},
] as NavigationType[];

export const courseNavLinks = [
	{
		title: "Overview",
		labelKey: "course.overview",
		icon: <AiOutlineHome className={cn("", defaultNavLinkClassName)} />,
		href: ".",
		end: true,
		disabled: false,
	},
	{
		title: "Schedule",
		labelKey: "course.schedule",
		icon: <AiOutlineCalendar className={cn("", defaultNavLinkClassName)} />,
		href: "schedule",
		end: false,
		disabled: false,
	},
	{
		title: "Updates",
		labelKey: "course.updates",
		icon: <AiOutlineNotification className={cn("", defaultNavLinkClassName)} />,
		href: "updates",
		end: false,
		disabled: false,
	},
	{
		title: "Resources",
		labelKey: "course.resources",
		icon: <Files className={cn("", defaultNavLinkClassName)} />,
		href: "resources",
		end: false,
		disabled: false,
	},
	{
		title: "Tasks",
		labelKey: "course.tasks",
		icon: <ClipboardList className={cn("", defaultNavLinkClassName)} />,
		href: "tasks",
		end: false,
		disabled: false,
	},
	{
		title: "Plans",
		labelKey: "course.plans",
		icon: <Route className={cn("", defaultNavLinkClassName)} />,
		href: "plans",
		end: false,
		disabled: false,
	},
	{
		title: "Participants",
		labelKey: "course.participants",
		icon: <Users2 className={cn("", defaultNavLinkClassName)} />,
		href: "participants",
		end: false,
		disabled: false,
	},
	{
		title: "Course Information",
		labelKey: "course.info",
		icon: <AiOutlineInfoCircle className={cn("", defaultNavLinkClassName)} />,
		href: "course-information",
		end: false,
		disabled: false,
	},
] as NavigationType[];

export const combinedNavLinks = [
	...navlinks,
	...courseNavLinks,
] as NavigationType[];
