import { TooltipProvider } from "@/components/ui/tooltip";
import { useCourse } from "@/hooks/atoms/useCourse";
import { useSidebar } from "@/hooks/atoms/useSidebar";
import { courseNavLinks, navlinks } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import React, { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { NavLink } from "react-router-dom";
import SidebarGroupTitle from "./sidebar-group-title";
import SidebarUserFallback from "./sidebar-user-fallback";

const LazySidebarItem = lazy(() => import("./sidebar-item"));
const LazySidebarUser = lazy(() => import("./sidebar-user"));

export default function Sidebar() {
  const { sidebarActive, setSidebarActive } = useSidebar();
  const { courseId } = useCourse();
  const courseActive = courseId !== undefined;
  return (
    <TooltipProvider delayDuration={100}>
      <div
        onMouseEnter={() => setSidebarActive(true)}
        onMouseLeave={() => setSidebarActive(false)}
        className={cn(
          "min-w-0 will-change-auto overflow-hidden no-drag top-0 transition-all h-full py-6 pb-4 px-2.5 z-20 bg-background flex flex-col justify-between",
          // sidebarActive ? 'w-64' : 'w-24'
        )}
      >
        <div className="flex h-full flex-col gap-1 overflow-x-hidden scrollbar-hide">
          {/* <SidebarGroupTitle title='General' /> */}
          {navlinks.map((link) => (
            <Suspense fallback={null} key={link.href}>
              <LazySidebarItem
                href={link.href}
                title={link.title}
                icon={link.icon}
                end={link.end}
                disabled={link.disabled}
              />
            </Suspense>
          ))}
          <AnimatePresence>
            {courseActive && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 flex flex-col gap-1"
              >
                <hr className="my-3" />
                {/* <SidebarGroupTitle title='Course' /> */}
                {courseNavLinks.map((link) => (
                  <Suspense fallback={null} key={link.href}>
                    <LazySidebarItem
                      href={`/courses/${courseId}${link.end ? "" : "/" + link.href}`}
                      title={link.title}
                      icon={link.icon}
                      end={link.end}
                      disabled={link.disabled}
                    />
                  </Suspense>
                ))}
              </m.div>
            )}
          </AnimatePresence>
        </div>
        <hr className="mb-3" />
        <NavLink
          to={"/profile"}
          className={({ isActive }) =>
            cn(
              "rounded-md flex py-2 px-2.5 text-left hover:bg-foreground/10 transition-all",
              isActive && "bg-foreground/10",
            )
          }
        >
          <ErrorBoundary fallback={<SidebarUserFallback />}>
            <Suspense fallback={null}>
              <LazySidebarUser />
            </Suspense>
          </ErrorBoundary>
        </NavLink>
      </div>
    </TooltipProvider>
  );
}
