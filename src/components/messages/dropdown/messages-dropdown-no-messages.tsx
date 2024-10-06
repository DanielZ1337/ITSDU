import { AlertCircle } from "lucide-react";

export default function MessagesDropdownNoMessages() {
  return (
    <div className="flex h-72 w-full flex-col items-center justify-center py-6">
      <AlertCircle className={"stroke-destructive"} />
      <h3 className="mt-4 text-xl font-medium text-foreground">No messages</h3>
      <p className="px-6 text-center text-muted-foreground">
        You currently don&apos;t have any messages.
      </p>
    </div>
  );
}
