import useGETcurrentUser from './queries/person/useGETcurrentUser'
import {Avatar, AvatarFallback, AvatarImage} from './components/ui/avatar'

export default function HeaderUserFullnameAvatar() {

    const {data} = useGETcurrentUser({
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
    })
    return (
        <div className={"flex flex-row items-center justify-center gap-2"}>
            <Avatar className={"flex-shrink-0 w-8 h-8"}>
                <AvatarImage src={data?.ProfileImageUrl}
                             alt={data?.FullName}
                             className={"object-cover"}
                />
                <AvatarFallback className={"bg-foreground/20 text-sm"}>
                    {data?.FullName.split(" ").map((name) => name[0]).join("")}
                </AvatarFallback>
            </Avatar>
            <p className={"text-lg font-semibold line-clamp-1 break-all"}>{data?.FullName}</p>
        </div>
    )
}
