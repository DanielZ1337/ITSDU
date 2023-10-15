import useGETcurrentUser from '@/queries/person/useGETcurrentUser';

export default function SettingsDropdownUserFullname() {
    const {data} = useGETcurrentUser({
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        suspense: true
    })

    return (
        <span>
            {data!.FullName}
        </span>
    )
}
