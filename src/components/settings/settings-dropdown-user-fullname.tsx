import { useUser } from "@/hooks/atoms/useUser.ts";

export default function SettingsDropdownUserFullname() {
  const user = useUser();

  return <span>{user?.FullName}</span>;
}
