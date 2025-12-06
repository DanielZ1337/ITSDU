import { TooltipProvider } from "@/components/ui/tooltip";
import { useCourse } from "@/hooks/atoms/useCourse";
import { useSidebar } from "@/hooks/atoms/useSidebar";
import { courseNavLinks, navlinks } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SidebarUserFallback from "./sidebar-user-fallback";

const LazySidebarItem = lazy(() => import("./sidebar-item"));
const LazySidebarUser = lazy(() => import("./sidebar-user"));

export default function Sidebar() {
	const { setSidebarActive } = useSidebar();
	const { courseId } = useCourse();
	const courseActive = courseId !== undefined;

	return (
		<TooltipProvider delayDuration={100}>
			<aside
				onMouseEnter={() => setSidebarActive(true)}
				onMouseLeave={() => setSidebarActive(false)}
				className={cn(
					"group/sidebar no-drag h-full flex flex-col",
					"py-4 px-2 z-20 bg-background/80 backdrop-blur-sm",
				)}
			>
				{/* Main navigation */}
				<nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
					{navlinks.map((link, index) => (
						<Suspense fallback={null} key={link.href}>
							<m.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									delay: index * 0.03,
									duration: 0.2,
									ease: "easeOut"
								}}
							>
								<LazySidebarItem
									href={link.href}
									title={link.title}
									icon={link.icon}
									end={link.end}
									disabled={link.disabled}
								/>
							</m.div>
						</Suspense>
					))}

					{/* Course navigation section */}
					<AnimatePresence mode="popLayout">
						{courseActive && (
							<m.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{
									duration: 0.2,
									ease: [0.4, 0, 0.2, 1],
								}}
								className="flex flex-col gap-0.5"
							>
								<div className="my-3 mx-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
								{courseNavLinks.map((link, index) => (
									<Suspense fallback={null} key={link.href}>
										<m.div
											initial={{ opacity: 0.01, x: -8 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												delay: index * 0.03,
												duration: 0.2,
												ease: "easeOut"
											}}
										>
											<LazySidebarItem
												href={`/courses/${courseId}${link.end ? "" : "/" + link.href}`}
												title={link.title}
												icon={link.icon}
												end={link.end}
												disabled={link.disabled}
											/>
										</m.div>
									</Suspense>
								))}
							</m.div>
						)}
					</AnimatePresence>
				</nav>

				{/* User section */}
				<div className="mt-auto pt-2">
					<div className="mx-2 mb-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
					<ErrorBoundary fallback={<SidebarUserFallback />}>
						<Suspense fallback={<SidebarUserFallback />}>
							<LazySidebarUser />
						</Suspense>
					</ErrorBoundary>
				</div>
			</aside>
		</TooltipProvider>
	);
}
