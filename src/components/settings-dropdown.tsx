import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { MoreVertical } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useCallback, useEffect, useState } from "react";
import SettingsDropdownUserFullname from "@/components/settings-dropdown-user-fullname.tsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import SettingsModal from "./settings-modal";

export default function SettingsDropdown() {
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()
    // eslint-disable-next-line no-unused-vars
    const [version, setVersion] = useState<string>()

    useEffect(() => {
        window.app.getVersion().then((version: string) => {
            setVersion(version)
        })
    }, [])

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


    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({
                variant: 'ghost',
                size: 'icon'
            }))}>
                <MoreVertical />
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
                            <SettingsDropdownUserFullname />
                        </Suspense>
                    </ErrorBoundary>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDarkModeToggle}>
                    <span className={"text-sm"}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsModal />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        window.auth.store.clear().then(() => {
                            window.app.exit().then(r => {
                                console.log(r)
                            })
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
    )
}