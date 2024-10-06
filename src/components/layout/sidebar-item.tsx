import { useSidebar } from "@/hooks/atoms/useSidebar";
import { cn } from "@/lib/utils";
import { NavigationType } from "@/types/navigation-link";
import { Link, useMatch, useMatches } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function SidebarItem({
  title,
  icon,
  href,
  end = true,
  disabled,
}: NavigationType) {
  const { sidebarActive } = useSidebar();

  // ({ isActive, isPending }) =>
  //

  const match = useMatch({
    from: href,
    shouldThrow: false,
  });

  const isActive = !!match;
  // todo: not correct
  const isPending = match?.isFetching;

  return (
    <Link
      onClick={(e) => disabled && e.preventDefault()}
      className={cn(
        "animate-in slide-in-from-left-6 relative flex items-center p-2 rounded-md cursor-pointer hover:text-foreground",
        isActive ? "text-foreground" : "text-foreground/60",
        isPending && "opacity-50",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      to={href}
      end={end}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="active-pill"
              transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
              className={cn(
                "inset-0 absolute bg-accent rounded-lg bg-gradient-to-tr from-accent to-background/60 transition-shadow",
                sidebarActive && "shadow-md shadow-primary/5",
              )}
            />
          )}
          <span className="relative z-10 p-1 ml-2.5">{icon}</span>
          <span
            className={cn(
              "whitespace-nowrap text-left z-10 relative overflow-hidden transition-all pl-4",
              sidebarActive ? "w-full opacity-100" : "w-0 opacity-0 ",
            )}
          >
            {title}
          </span>
        </>
      )}
    </Link>
  );
}
