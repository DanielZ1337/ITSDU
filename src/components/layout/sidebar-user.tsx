import { useUser } from '@/hooks/atoms/useUser'
import SettingsDropdown from '@/components/settings/settings-dropdown'
import ProfileAvatar from '../profile-avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function SidebarUser() {
	const user = useUser()

	const [isOpen, setIsOpen] = useState(false)

	const [isOpenSettings, setIsOpenSettings] = useState(false)

	return (
		<Tooltip
			open={isOpen || isOpenSettings}
			onOpenChange={setIsOpen}
		>
			<TooltipTrigger>
				<ProfileAvatar
					src={user?.ProfileImageUrl}
					name={user?.FullName}
					className={'w-10 h-10 border-2 border-primary/30'}
					classNameFallback={'bg-foreground/10 font-normal text-sm'}
				/>
				{/* <div className={`pl-4 flex justify-between items-center overflow-hidden transition-all`}>
					<div className='pr-4 leading-4'>
						<h4 className='whitespace-pre-wrap break-all font-semibold line-clamp-1'>{user?.FullName}</h4>
					</div>
					<SettingsDropdown />
				</div> */}
			</TooltipTrigger>
			<TooltipContent side='right'>
				<div className='p-2 flex justify-between items-center overflow-hidden transition-all'>
					<div className='pr-4 leading-4'>
						<h4 className='whitespace-pre-wrap break-all font-semibold line-clamp-1'>{user?.FullName}</h4>
					</div>
					<SettingsDropdown
						triggerComponent={<MoreVertical className='h-6 w-6 p-0.5' />}
						onOpenChange={setIsOpenSettings}
					/>
				</div>
			</TooltipContent>
		</Tooltip>
	)
}
