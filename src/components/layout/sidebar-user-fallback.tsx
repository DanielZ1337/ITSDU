import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default function SidebarUserFallback() {
  return (
    <Avatar className={"flex-shrink-0 w-10 h-10"}>
      <AvatarFallback className={"bg-foreground/20 text-sm"}></AvatarFallback>
    </Avatar>
  );
}
