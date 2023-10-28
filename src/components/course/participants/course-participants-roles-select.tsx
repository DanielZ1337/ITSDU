import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown} from "lucide-react";
import {CourseParticipantRole, CourseParticipantRoleLabels} from "@/types/course-participants-roles.ts";
import {useState} from "react";

export default function CourseParticipantsRolesSelect() {
    // @ts-ignore
    const allRolesIds = Object.keys(CourseParticipantRoleLabels) as CourseParticipantRole[]
    const [selectedRolesIds, setSelectedRolesIds] = useState<CourseParticipantRole[]>(allRolesIds);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto select-none">
                    Roles <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={"w-52"}>
                {/* @ts-ignore */}
                {Object.entries(CourseParticipantRoleLabels).map(([id, label]: [CourseParticipantRole, string]) => (
                    <DropdownMenuCheckboxItem onCheckedChange={(checked) => {
                        if (checked) {
                            setSelectedRolesIds((prev) => [...prev, id])
                        } else {
                            setSelectedRolesIds((prev) => prev.filter((prevId) => prevId !== id))
                        }
                    }} checked={selectedRolesIds.includes(id)}
                                              textValue={label} key={id}>
                        {label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}