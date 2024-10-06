import { cn } from "@/lib/utils";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { m } from "framer-motion";
import { SetStateAction } from "jotai";
import { Button } from "../ui/button";

export default function SettingsSidebarButton({
  currentSection,
  value,
  label,
  currentHover,
  setCurrentHover,
}: {
  currentSection: string;
  value: string;
  label: string;
  currentHover: string | null;
  setCurrentHover: React.Dispatch<SetStateAction<string | null>>;
}) {
  const isActive = currentSection === value;
  const isHoverActive = currentHover === value;

  return (
    <TabsTrigger className="relative w-full" value={value} asChild>
      <Button
        onMouseEnter={() => setCurrentHover(value)}
        onMouseLeave={() => setCurrentHover(null)}
        className={cn(
          "w-full",
          isActive && (isHoverActive || !currentHover)
            ? "bg-foreground-100 text-foreground border-2 border-purple-500"
            : "bg-foreground-200 text-foreground-600",
        )}
        variant={"ghost"}
        size={"lg"}
      >
        {label}
        {isHoverActive ? <ActiveSettingsPill /> : isActive && <ActiveSettingsPill />}
      </Button>
    </TabsTrigger>
  );
}

function ActiveSettingsPill() {
  return (
    <m.div
      layoutId="active-settings-pill"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
      className={cn("flex items-center justify-center h-full top-0 right-0 absolute")}
    >
      <div className="absolute right-2 h-3 w-3 rounded-full bg-purple-500" />
    </m.div>
  );
}
