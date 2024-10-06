import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  CourseParticipantRole,
  CourseParticipantRoleLabels,
} from "@/types/course-participants-roles.ts";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CourseParticipantsRolesSelect({
  roleIds,
  onChange,
}: {
  roleIds: CourseParticipantRole[];
  onChange: (roleIds: CourseParticipantRole[]) => void;
}) {
  // @ts-ignore
  const [selectedRolesIds, setSelectedRolesIds] =
    useState<CourseParticipantRole[]>(roleIds);

  const CourseParticipantRoleLabelsFromRoleIds = Object.fromEntries(
    Object.entries(CourseParticipantRoleLabels).filter(([roleId]) =>
      roleIds.includes(Number(roleId)),
    ),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto select-none">
          Roles <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={"w-52"}>
        {/* @ts-ignore */}
        {Object.entries(CourseParticipantRoleLabelsFromRoleIds).map(([roleId, label]) => (
          <DropdownMenuCheckboxItem
            key={roleId}
            checked={selectedRolesIds.includes(Number(roleId))}
            onCheckedChange={(checked) => {
              const newSelectedRolesIds = [...selectedRolesIds];
              if (checked) {
                newSelectedRolesIds.push(Number(roleId));
              } else {
                newSelectedRolesIds.splice(
                  newSelectedRolesIds.indexOf(Number(roleId)),
                  1,
                );
              }
              setSelectedRolesIds(newSelectedRolesIds);
              onChange(newSelectedRolesIds);
            }}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
