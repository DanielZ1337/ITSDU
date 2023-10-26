import { useUser } from '@/hooks/user'

export default function SettingsDropdownUserFullname() {
    const user = useUser()

    return (
        <span>
            {user?.FullName}
        </span>
    )
}
