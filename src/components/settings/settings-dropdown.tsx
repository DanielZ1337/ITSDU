import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {cn} from "@/lib/utils.ts";
import {buttonVariants} from "@/components/ui/button.tsx";
import {MoreVertical} from "lucide-react";
import {ErrorBoundary} from "react-error-boundary";
import {Suspense, useCallback, useEffect} from "react";
import SettingsDropdownUserFullname from "@/components/settings/settings-dropdown-user-fullname.tsx";
import {useNavigate} from "react-router-dom";
import {useTheme} from "next-themes";
import {useAtom} from "jotai";
import {browseNavigationAtom as showBrowseNavAtom} from '../../atoms/browse-navigation.ts';
import {useShowSettingsModal} from "@/hooks/atoms/useSettingsModal.ts";
import {useVersion} from "@/hooks/atoms/useVersion.ts";
import {useAboutModal} from "@/hooks/atoms/useAboutModal.ts";

export default function SettingsDropdown() {
    const navigate = useNavigate()
    const {theme, setTheme} = useTheme()
    const {version} = useVersion()
    const [showBrowseNav, setShowBrowseNav] = useAtom(showBrowseNavAtom);
    const {toggleSettingsModal} = useShowSettingsModal()
    const {toggleAboutModal} = useAboutModal()

    const handleDarkModeToggle = useCallback(async () => {
        const isDarkMode = await window.darkMode.toggle()
        setTheme(isDarkMode ? 'dark' : 'light')
    }, [setTheme]);

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
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleDarkModeToggle, navigate]);

    function dropdownItemOnClick(e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>, callback: () => void) {
        e.stopPropagation()
        e.preventDefault()
        callback()
    }


    return (
        <DropdownMenu
            modal={false}
        >
            <DropdownMenuTrigger className={cn(buttonVariants({
                variant: 'ghost',
                size: 'icon'
            }))} asChild
                                 onClick={(e) => {
                                     e.stopPropagation()
                                     e.preventDefault()
                                 }}
            >
                <MoreVertical className="w-8 h-8"/>
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
                <DropdownMenuItem onClick={(e) => dropdownItemOnClick(e, () => {
                    handleDarkModeToggle()
                })}>
                    <span className={"text-sm"}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) =>
                        dropdownItemOnClick(e, () => {
                            toggleSettingsModal()
                        })}
                >
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) =>
                        dropdownItemOnClick(e, () => {
                            setShowBrowseNav(!showBrowseNav)
                        })}
                >
                    Browser Navbar
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Keyboard shortcuts</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) =>
                        dropdownItemOnClick(e, () => {
                            toggleAboutModal()
                        })}
                >
                    <span>About</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={() => {
                        window.auth.store.clear().then(() => {
                            /* window.app.exit().then(r => {
                                console.log(r)
                            }) */
                        })
                    }}
                    className={"hover:!bg-destructive focus:!bg-destructive hover:!text-white"}
                >
                    <span>Sign out</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        window.app.exit().then(r => {
                            console.log(r)
                        })
                    }}
                    className={"hover:!bg-destructive focus:!bg-destructive hover:!text-white"}
                >
                    <span>Exit</span>
                    <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}