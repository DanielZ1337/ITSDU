import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown} from "lucide-react";
import {CourseParticipantsRoles} from "@/types/course-participants-roles.ts";

export default function CourseParticipantsRolesSelect() {
    // const [selectedRolesIds, setSelectedRolesIds] = useState<CourseParticipantsRolesMappedToIds[]>([]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto select-none">
                    Roles <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={"w-52"}>
                {Object.values(CourseParticipantsRoles).map((role) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={role}
                        >
                            {role}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}