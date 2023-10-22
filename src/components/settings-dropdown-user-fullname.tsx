import { useUser } from '@/atoms/user';

export default function SettingsDropdownUserFullname() {
    const user = useUser()

    return (
        <span>
            {user?.FullName}
        </span>
    )
}
