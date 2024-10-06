import ParseMarkdown from "@/components/parse-markdown.tsx";
import { cn } from "@/lib/utils";
import { MessageRole } from "@/types/api-types/AI/GETpreviousMessages";
import { Suspense } from "react";
import { Loader } from "../ui/loader";
import MessageAvatar from "./message-avatar";

export default function Message({
  message,
  children,
  role,
}: {
  message?: string;
  children?: React.ReactNode;
  role: MessageRole;
}) {
  return (
    <div
      className={cn(
        "flex flex-row items-start justify-start py-3 overflow-x-hidden",
        role === "user" && "flex-row-reverse",
      )}
    >
      <div className="flex-shrink-0">
        <MessageAvatar role={role} />
      </div>
      <div className="mx-2 flex flex-col overflow-x-hidden drop-shadow">
        <span className={cn("font-bold", role === "user" ? "text-right" : "text-left")}>
          {role === "user" ? "You" : "ITSDU AI"}
        </span>
        <span
          className={cn(
            "text-white max-w-full bg-primary/30 rounded-md p-2 w-fit whitespace-pre-wrap",
            role === "user" ? "bg-blue-500" : "bg-green-600",
          )}
        >
          {children && (
            <span className="flex items-center justify-center">{children}</span>
          )}
          <Suspense fallback={<Loader />}>
            {message && <ParseMarkdown code={message} />}
          </Suspense>
        </span>
      </div>
    </div>
  );
}
