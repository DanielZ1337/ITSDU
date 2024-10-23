import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'

export default function SidebarUserFallback() {
	return (
		<Avatar className={'flex-shrink-0 w-10 h-10 py-2 px-2.5'}>
			<AvatarFallback className={'bg-foreground/20 text-sm'}></AvatarFallback>
		</Avatar>
	)
}
