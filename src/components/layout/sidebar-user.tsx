import SettingsDropdown from '@/components/settings/settings-dropdown'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useUser } from '@/hooks/atoms/useUser'
import { MoreVertical } from 'lucide-react'
import { useState } from 'react'
import ProfileAvatar from '../profile-avatar'
import { cn } from '@nextui-org/react'
import { buttonVariants } from '@/components/ui/button'

export default function SidebarUser() {
	const user = useUser()

	const [isOpen, setIsOpen] = useState(false)
	const [isHovering, setIsHovering] = useState(false)

	return (
		<SettingsDropdown
			triggerComponent={
				<button
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					className='w-full h-full py-2 px-2.5'
				>
					<ProfileAvatar
						src={user?.ProfileImageUrl}
						name={user?.FullName}
						className={'w-10 h-10 border-2 border-primary/30'}
						classNameFallback={'bg-foreground/10 font-normal text-sm'}
					/>
				</button>
			}
			isOpen={isHovering || isOpen}
			onOpenChange={setIsOpen}
		/>
	)
}
