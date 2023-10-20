import {Button, buttonVariants} from '@/components/ui/button'
import {ArrowLeftSquareIcon, ArrowRightSquareIcon, HomeIcon, MoreVertical, RefreshCwIcon} from 'lucide-react'
import {Suspense, useCallback, useEffect, useState} from 'react'
import {Input} from './ui/input'
import {useLocation, useNavigate, useNavigation, useSearchParams} from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from './ui/dropdown-menu'
import {useTheme} from "next-themes";
import {cn} from "@/lib/utils.ts";
import SettingsDropdownUserFullname from './settings-dropdown-user-fullname'
import {ErrorBoundary} from 'react-error-boundary'

export default function BrowserNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const [address, setAddress] = useState(pathname)
    const navigation = useNavigation();
    const {theme, setTheme} = useTheme()
    // eslint-disable-next-line no-unused-vars
    let [searchParams] = useSearchParams();
    const [version, setVersion] = useState<string>()

    useEffect(() => {
        window.app.getVersion().then((version: string) => {
            setVersion(version)
        })
    }, [])

    searchParams.forEach((value, key) => console.log(key, value));

    const handleDarkModeToggle = useCallback(async () => {
        const isDarkMode = await window.darkMode.toggle()
        setTheme(isDarkMode ? 'dark' : 'light')
    }, [setTheme]);

    useEffect(() => {
        const pathname = location.pathname
        const search = location.search
        setAddress(pathname + search)
        // console.log(navigation)
    }, [location.pathname, location.search, navigation]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault()
                handleDarkModeToggle()
            }

            if (e.ctrlKey && e.key === 'q') {
                e.preventDefault()
                window.app.exit().then(r => {
                    console.log(r)
                })
            }

            // alt left and right arrow
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault()
                navigate(-1)
            } else if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault()
                navigate(1)
            }

            if (e.ctrlKey && e.key === 'r') {
                e.stopPropagation()
                console.log('reload')
                navigate(0)
            }

            if (e.ctrlKey && e.key === 'l') {
                e.stopPropagation()
                console.log('focus address bar')
                document.querySelector('input')?.focus()
                console.log(document.querySelector('input'))
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleDarkModeToggle, navigate]);


    let isNormalLoad =
        navigation.state === "loading" &&
        navigation.formData == null;

    // Are we reloading after an action?
    let isReloading =
        navigation.state === "loading" &&
        navigation.formData != null &&
        navigation.formAction === navigation.location.pathname;

    // Are we redirecting after an action?
    let isRedirecting =
        navigation.state === "loading" &&
        navigation.formData != null &&
        navigation.formAction !== navigation.location.pathname;

    useEffect(() => {
        console.log(navigation.state)
        console.log(isNormalLoad)
        console.log(isReloading)
        console.log(isRedirecting)
    }, [isNormalLoad, isRedirecting, isReloading, navigation, pathname]);

    return (
        <div className='flex w-full py-4 px-2 justify-center items-center gap-1 border-b-foreground-50 border-b-2'>
            {/* Back button */}
            <Button variant={"ghost"} size={"icon"}
                    onClick={() => navigate(-1)}><ArrowLeftSquareIcon/></Button>
            {/* Forward button */}
            <Button variant={"ghost"} size={"icon"}
                    onClick={() => navigate(1)}><ArrowRightSquareIcon/></Button>
            {/* Reload button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => navigate(0)}><RefreshCwIcon/></Button>
            {/* Home button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => navigate('/')}><HomeIcon/></Button>
            {/* Address bar */}
            <form onSubmit={(e) => {
                e.preventDefault()
                navigate(address)
            }} className='w-full px-2'>
                <Input className='w-full' type="text" value={address}
                       onClick={(e) => e.currentTarget.setSelectionRange(1, e.currentTarget.value.length)}
                       onChange={(e) => setAddress(e.target.value)}/>
            </form>
            {/*    more settings dropdown*/}
            <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({
                    variant: 'ghost',
                    size: 'icon'
                }))}>
                    <MoreVertical/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className={"flex justify-between items-center"}>
                        <span className={"text-sm"}>
                            Settings
                        </span>
                        <span className={"text-xs text-gray-500"}>
                            {version}
                        </span>
                    </DropdownMenuLabel>
                    {/*user name*/}
                    <DropdownMenuLabel className={"font-normal"}>
                        <ErrorBoundary fallback={<div className={"animate-pulse"}>Loading...</div>}>
                            <Suspense fallback={<div className={"animate-pulse"}>Loading...</div>}>
                                <SettingsDropdownUserFullname/>
                            </Suspense>
                        </ErrorBoundary>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={handleDarkModeToggle}>
                        <span className={"text-sm"}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                        <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/*<DropdownMenuItem>Profile</DropdownMenuItem>*/}
                    {/*<DropdownMenuItem>Billing</DropdownMenuItem>*/}
                    {/*<DropdownMenuItem>Team</DropdownMenuItem>*/}
                    {/*<DropdownMenuItem>Subscription</DropdownMenuItem>*/}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onClick={() => {
                            localStorage.clear()
                            window.app.exit().then(r => {
                                console.log(r)
                            })
                        }}
                        className={"hover:!bg-destructive focus:!bg-destructive"}
                    >
                        <span>Sign out</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            window.app.exit().then(r => {
                                console.log(r)
                            })
                        }}
                        className={"hover:!bg-destructive focus:!bg-destructive"}
                    >
                        <span>Exit</span>
                        <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
