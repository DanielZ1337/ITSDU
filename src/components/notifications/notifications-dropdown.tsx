import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {AiOutlineNotification} from 'react-icons/ai';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '../ui/scroll-area';
import useGETnotifications from '@/queries/notifications/useGETnotifications';
import {getRelativeTimeString} from '@/lib/utils';

export default function NotificationsDropdown() {

    const {data: notifications} = useGETnotifications({
        FromId: 0,
        PageSize: 10,
        UseNewerThan: true,
    }, {
        suspense: true
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"shrink-0"}
                >
                    <AiOutlineNotification className={"w-6 h-6"}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <ScrollArea className={"max-h-96 overflow-y-auto p-2 flex-1"}>
                    {notifications?.EntityArray.map(notification => (
                        <div className={"flex flex-col gap-1 p-4 hover:bg-foreground/10 rounded-md my-1"}
                             key={notification.NotificationId}>
                            <div className={"flex flex-row gap-1"}>
                                <div className={"flex flex-col"}>
                                        <span
                                            className={"text-sm font-semibold"}>{notification.PublishedBy.FullName}</span>
                                    <span
                                        className={"text-xs text-gray-400"}>{getRelativeTimeString(new Date(notification.PublishedDate))}</span>
                                </div>
                            </div>
                            <div className={"flex flex-row gap-1"}>
                                <div className={"flex flex-col"}>
                                    <span className={"text-xs text-gray-400"}>{notification.Text}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
