import { lazy, Suspense, useEffect, useRef } from 'react'
import { cn } from '../lib/utils'
import { ErrorBoundary } from 'react-error-boundary'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '@nextui-org/spinner'
import MessagesDropDownSkeleton from '@/components/messages/dropdown/fallbacks/messages-dropdown-titlebar-fallback'
import NotificationsDropDownSkeleton from '@/components/notifications/fallback/notifications-dropdown-fallback'
import { useSidebar } from '@/hooks/atoms/useSidebar'
import { useToast } from './ui/use-toast'
import { useDownloadToast } from './recursive-file-explorer'

const ToasterLazy = lazy(() => import('@/components/ui/toaster').then((module) => ({ default: module.Toaster })))
const ScrollToTopButtonLazy = lazy(() => import('@/components/scroll-to-top-button'))
const MessagesDropdown = lazy(() => import('@/components/messages/dropdown/messages-dropdown'))
const NotificationsDropdown = lazy(() => import('@/components/notifications/notifications-dropdown'))
const BrowserNavLazy = lazy(() => import('@/components/browse-nav'))
const TitlebarButtonsLazy = lazy(() => import('@/components/titlebar/titlebar'))
const TitlebarSearchLazy = lazy(() => import('@/components/titlebar/titlebar-search'))
const SettingsModalLazy = lazy(() => import('@/components/settings/settings-modal'))
const AboutModalLazy = lazy(() => import('@/components/about-modal'))
const IsOnlineIndicatorLazy = lazy(() => import('@/components/is-online-indicator'))
const SidebarLazy = lazy(() => import('./layout/sidebar'))
const TitlebarButtonLazy = lazy(() => import('./titlebar/titlebar-button'))
const SuspenseWrapperLazy = lazy(() => import('./suspense-wrapper'))

export default function Layout() {
	const { sidebarActive } = useSidebar()
	const ref = useRef<HTMLDivElement>(null)
	useDownloadToastListener()

	const { pathname } = useLocation()

	return (
		<div className='flex h-screen max-h-screen min-h-screen flex-col overflow-hidden'>
			<Suspense fallback={<IsOnlineIndicatorLazy />}>
				<IsOnlineIndicatorLazy />
			</Suspense>
			<div className='flex items-center justify-between border-b px-4 py-2 drag border-background/40'>
				<Link
					className='shrink-0 no-drag'
					to={'/'}
				>
					<img
						loading='eager'
						src='itsl-itslearning-file://i_logo_colored.png'
						alt='itslearning'
						className='my-auto mt-2 ml-4 h-8 w-8'
					/>
				</Link>
				<div className='w-full max-w-xl px-4'>
					<ErrorBoundary
						fallback={
							<Suspense fallback={<TitlebarButtonLazy disabled />}>
								<TitlebarButtonLazy />
							</Suspense>
						}
					>
						<Suspense fallback={<TitlebarButtonLazy disabled />}>
							<TitlebarSearchLazy />
						</Suspense>
					</ErrorBoundary>
				</div>
				<div className={'no-drag flex flex-row items-center justify-center gap-4'}>
					<ErrorBoundary
						fallback={
							<Suspense fallback={<MessagesDropDownSkeleton />}>
								<MessagesDropDownSkeleton />
							</Suspense>
						}
					>
						<Suspense fallback={<MessagesDropDownSkeleton />}>
							<MessagesDropdown />
						</Suspense>
					</ErrorBoundary>
					<ErrorBoundary
						fallback={
							<Suspense fallback={<NotificationsDropDownSkeleton />}>
								<NotificationsDropDownSkeleton />
							</Suspense>
						}
					>
						<Suspense fallback={<NotificationsDropDownSkeleton />}>
							<NotificationsDropdown />
						</Suspense>
					</ErrorBoundary>
					<Suspense fallback={<TitlebarButtonsLazy />}>
						<TitlebarButtonsLazy />
					</Suspense>
				</div>
			</div>
			<Suspense fallback={null}>
				<BrowserNavLazy />
			</Suspense>
			<div className='relative flex max-h-screen flex-1 flex-col overflow-hidden drag bg-background'>
				<Suspense fallback={null}>
					<SidebarLazy />
				</Suspense>
				<div
					className={
						'no-drag ml-24 h-full flex flex-1 overflow-hidden dark:bg-foreground/[2%] transition-all rounded-tl-md border-t border-l'
					}
				>
					<ErrorBoundary fallback={<div>ERROR</div>}>
						<Suspense
							fallback={
								<Spinner
									size='lg'
									color='primary'
									label='Loading...'
									className={'m-auto'}
								/>
							}
						>
							<div
								className='flex flex-1 flex-col overflow-x-auto overflow-y-auto'
								/*style={{
                                    scrollbarGutter: "stable both-edges"
                                }}*/
								ref={ref}
								key={pathname}
							>
								<SuspenseWrapperLazy>
									<Outlet />
								</SuspenseWrapperLazy>
							</div>
						</Suspense>
					</ErrorBoundary>
				</div>
				<div
					className={cn(
						'pointer-events-none absolute top-0 left-0 h-full w-full bg-black/50 transition-all backdrop-blur-lg z-10 shadow-sm',
						sidebarActive ? 'opacity-100' : 'opacity-0'
					)}
				/>
				<Suspense fallback={null}>
					<ScrollToTopButtonLazy viewportRef={ref} />
					<ToasterLazy />
					<SettingsModalLazy />
					<AboutModalLazy />
				</Suspense>
			</div>
		</div>
	)
}

// function ToasterListener() {
// 	const { toast } = useToast()

// 	useEffect(() => {
// 		const handleToastClose = (toastId: string) => {
// 			toast.dismiss(toastId)
// 		}

// 		window.ipcRenderer.on('toast:close', handleToastClose)

// 		return () => {
// 			window.ipcRenderer.removeListener('toast:close', handleToastClose)
// 		}
// 	}, [toast])

// 	return null
// }

function useDownloadToastListener() {
	const { toast, dismiss, toasts } = useToast()

	useEffect(() => {
		window.ipcRenderer.addListener('download:complete', (_, args) => {
			console.log(args)
			toast({
				title: 'Downloaded',
				description: args,
				duration: 3000,
				variant: 'success',
				onMouseDown: async () => {
					// if the user clicks on the toast, open the file
					// get the time that the mouse was pressed
					const mouseDownTime = Date.now()
					// wait for the mouse to be released
					await new Promise<void>((resolve) => {
						window.addEventListener(
							'mouseup',
							() => {
								resolve()
							},
							{ once: true }
						)
					})

					// if the mouse was pressed for less than 500ms, open the file
					if (Date.now() - mouseDownTime < 80) {
						console.log('Opening shell')
						await window.app.openShell(args)
						dismiss()
					} else {
						console.log('Not opening shell')
					}
				},
			})
		})

		window.ipcRenderer.once('download:error', (_, args) => {
			console.log(args)
			toast({
				title: 'Download error',
				description: args,
				duration: 3000,
				variant: 'destructive',
			})
		})

		return () => {
			window.ipcRenderer.removeListener('download:complete', (_, args) => {
				console.log(args)
				toast({
					title: 'Downloaded',
					description: args,
					duration: 3000,
					variant: 'success',
					onMouseDown: async () => {
						// if the user clicks on the toast, open the file
						// get the time that the mouse was pressed
						const mouseDownTime = Date.now()
						// wait for the mouse to be released
						await new Promise<void>((resolve) => {
							window.addEventListener(
								'mouseup',
								() => {
									resolve()
								},
								{ once: true }
							)
						})

						// if the mouse was pressed for less than 500ms, open the file
						if (Date.now() - mouseDownTime < 80) {
							console.log('Opening shell')
							await window.app.openShell(args)
							dismiss()
						} else {
							console.log('Not opening shell')
						}
					},
				})
			})

			window.ipcRenderer.removeListener('download:error', (_, args) => {
				console.log(args)
				toast({
					title: 'Download error',
					description: args,
					duration: 3000,
					variant: 'destructive',
				})
			})
		}
	}, [])
}
