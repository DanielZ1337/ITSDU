import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

export default function WeekHeaderDay({
  day,
  date,
  isActive,
  ...props
}: {
  day: string;
  date: string;
  isActive: boolean;
} & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={cn(
        "relative flex group rounded-lg mx-1 transition-all duration-300 cursor-pointer justify-center w-16",
        isActive
          ? "bg-purple-600 shadow-lg dark-shadow"
          : "hover:bg-purple-500 dark:bg-foreground/[2%] hover:shadow-lg hover-dark-shadow",
      )}
    >
      {isActive && (
        <span className="flex h-3 w-3 absolute -top-1 -right-1">
          <span className="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-purple-400"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-100"></span>
        </span>
      )}
      <div className="flex items-center px-4 py-4">
        <div className="text-center">
          <p
            className={cn(
              "group-hover:text-gray-100 text-sm transition-all duration-300",
              isActive ? "text-gray-100" : "text-gray-900",
            )}
          >
            {day}
          </p>
          <p
            className={cn(
              "transition-all duration-300",
              isActive
                ? "text-gray-100 mt-3 font-bold"
                : "text-gray-900 mt-3 group-hover:font-bold",
            )}
          >
            {date}
          </p>
        </div>
      </div>
    </button>
  );
}
