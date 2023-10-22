import { useUser, userAtom } from '@/atoms/user';
import useGETcurrentUser from '@/queries/person/useGETcurrentUser';
import { useAtom } from 'jotai';

export default function SettingsDropdownUserFullname() {
    const user = useUser()

    return (
        <span>
            {user?.FullName}
        </span>
    )
}
