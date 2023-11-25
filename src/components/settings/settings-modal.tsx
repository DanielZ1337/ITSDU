import { Divider } from "@nextui-org/divider";
import { useIntersectionObserver } from "@uidotdev/usehooks"
import React, { SetStateAction, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DividerProps, ScrollShadow } from "@nextui-org/react";
import {
    AlertTriangle,
    ComputerIcon,
    CookieIcon,
    MoonIcon,
    PencilIcon,
    SettingsIcon,
    SunIcon,
    User as UserIcon,
    X
} from "lucide-react";
import { useTheme } from "next-themes";
import { Spinner } from "@nextui-org/spinner";
import { useUser } from '@/hooks/atoms/useUser.ts'
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal.ts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from "../ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "../ui/button";
import { LanguageCombobox } from "../language-combobox";
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from "../ui/input";

export default function SettingsModal() {

    const { showSettingsModal, setShowSettingsModal } = useShowSettingsModal()

    return (
        <Dialog
            open={showSettingsModal}
            onOpenChange={setShowSettingsModal}
        >
            <DialogOverlay className="data-[state=open]:!bg-black/10 data-[state=closed]:!bg-black/0 transition-none data-[state=open]:!duration-500" />
            <DialogContent
                customClose={<CustomCloseButton />}
                className="h-screen w-screen md:w-screen max-w-full rounded-none md:rounded-none overflow-hidden focus:outline-none bg-neutral-100 dark:bg-neutral-800 data-[state=open]:!zoom-in-125 data-[state=closed]:!zoom-out-125 transition-none p-0 gap-0 flex flex-col"
            >
                <div className="drag w-full h-14" />
                <div className="px-10 h-full w-full flex flex-col gap-4 items-center justify-center py-14" >
                    <SettingsCustom />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function CustomCloseButton() {
    return (
        <DialogPrimitive.Close
            className={cn('border-2 border-transparent', "no-drag absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground")}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
    )
}

function ActiveSettingsPill() {
    return (
        <motion.div
            layoutId="active-settings-pill"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
            className={cn("flex items-center justify-center h-full top-0 right-0 absolute")}
        >
            <div className="rounded-full bg-purple-500 w-3 h-3 absolute right-2 " />
        </motion.div>
    )
} function SettingsButton({ currentSection, value, label, currentHover, setCurrentHover }: { currentSection: string, value: string, label: string, currentHover: string | null, setCurrentHover: React.Dispatch<SetStateAction<string | null>> }) {
    const isActive = currentSection === value;
    const isHoverActive = currentHover === value;

    return (
        <TabsTrigger className="w-full relative" value={value} asChild>
            <Button
                onMouseEnter={() => setCurrentHover(value)}
                onMouseLeave={() => setCurrentHover(null)}
                className={cn(
                    "w-full",
                    isActive && (isHoverActive || !currentHover)
                        ? "bg-foreground-100 text-foreground border-2 border-purple-500"
                        : "bg-foreground-200 text-foreground-600"
                )}
                variant={"ghost"}
                size={"lg"}
            >
                {label}
                {isHoverActive ? <ActiveSettingsPill /> : isActive && <ActiveSettingsPill />}
            </Button>
        </TabsTrigger>
    );
}

function SettingsCustom() {
    const [currentSection, setCurrentSection] = React.useState<string>('account');
    const [currentHover, setCurrentHover] = React.useState<string | null>(null);

    const memoizedCurrentSection = React.useMemo(() => currentSection, [currentSection]);
    const memoizedCurrentHover = React.useMemo(() => currentHover, [currentHover]);
    const rootRef = React.useRef<HTMLDivElement>(null)

    const SettingsCardSectionSettings = {
        root: rootRef,
        setCurrentSection: setCurrentSection
    }

    return (
        <div
            className={"flex flex-col gap-4 items-center w-full h-full p-4 lg:p-8 bg-foreground-50 rounded-xl"}>
            {/* <SettingsSidebar currentSection={currentSection} rootRef={rootRef} /> */}
            <Tabs defaultValue={currentSection} value={currentSection} onValueChange={setCurrentSection} orientation="vertical" className="flex md:flex-row flex-col gap-4 w-full h-full">
                <TabsList className="justify-start h-full flex md:flex-col flex-row gap-4 md:gap-2 p-2 min-w-[20vw] max-w-[30vw] overflow-x-auto md:overflow-y-auto">
                    <h1 className="text-foreground text-xl font-bold my-2 text-neutral-400">Settings</h1>
                    <Divider orientation={"horizontal"} className={"hidden md:block h-1 mb-4"} />
                    <SettingsButton
                        currentSection={memoizedCurrentSection}
                        value="Preferences"
                        label="Preferences"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                    <SettingsButton
                        currentSection={memoizedCurrentSection}
                        value="account"
                        label="Account"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                    <SettingsButton
                        currentSection={memoizedCurrentSection}
                        value="password"
                        label="Password"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                </TabsList>
                <Divider orientation={"vertical"} className={"hidden md:block h-full"} />
                <ScrollShadow hideScrollBar
                    className={"flex flex-col gap-4 w-full h-full py-2 overflow-y-auto"}
                    ref={rootRef}>
                    <SettingsCardSection title="Preferences" {...SettingsCardSectionSettings}>
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Dark Mode</h6>
                                <DarkModeSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Language</h6>
                                <LanguageSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Default Home Page</h6>
                                <DefaultHomePageSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Use Custom PDF Renderer</h6>
                                <CustomPDFRendererSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Enable/Disable Uploading AI Chats</h6>
                                <UploadAIChatsSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Default Sort Type for Course Cards</h6>
                                <DefaultSortTypeSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Default AI Chat Sidepanel</h6>
                                <DefaultChatSidepanelSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Default Sort Type for Updates</h6>
                                <DefaultSortTypeUpdatesSetting />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-foreground">Interval for Refreshing Access Tokens (in ms)</h6>
                                <RefreshAccessTokenIntervalSetting />
                            </div>
                        </div>
                    </SettingsCardSection>
                </ScrollShadow>
            </Tabs>
        </div>
    )
}

function DarkModeSetting() {
    const { theme } = useTheme()

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <ThemeChangeButton theme={"light"} />
                <ThemeChangeButton theme={"dark"} />
                <ThemeChangeButton theme={"system"} />
            </div>
            <div className="flex flex-row gap-2">
                <span className="text-foreground">Current Theme: {theme}</span>
            </div>
        </div>
    )
}

function LanguageSetting() {
    const user = useUser()!
    const [language, setLanguage] = useState<string>(user.Language)

    useEffect(() => {
        setLanguage(user.Language)
    }, [user.Language])

    return (
        <LanguageCombobox
        />
    )
}

function DefaultHomePageSetting() {
    const user = useUser()!
    const [defaultHomePage, setDefaultHomePage] = useState<string>("index")

    return (
        <div className="flex flex-col gap-2">
            <select
                value={defaultHomePage}
                onChange={(e) => {
                    setDefaultHomePage(e.target.value)
                }}
                className="w-full h-10 rounded-md border-2 border-foreground-200 bg-foreground-100 text-foreground-600 focus:outline-none focus:border-purple-500"
            >
                <option value="index">Index</option>
                <option value="dashboard">Dashboard</option>
                <option value="courses">Courses</option>
                <option value="calendar">Calendar</option>
                <option value="messages">Messages</option>
                <option value="settings">Settings</option>
            </select>
        </div>
    )
}

function CustomPDFRendererSetting() {
    const user = useUser()!
    const [customPDFRenderer, setCustomPDFRenderer] = useState<string>("true")

    return (
        <div className="flex flex-col gap-2">
            <select
                value={customPDFRenderer}
                onChange={(e) => {
                    setCustomPDFRenderer(e.target.value)
                }}
                className="w-full h-10 rounded-md border-2 border-foreground-200 bg-foreground-100 text-foreground-600 focus:outline-none focus:border-purple-500"
            >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
            </select>
        </div>
    )
}

function UploadAIChatsSetting() {
    const user = useUser()!
    const [uploadAIChats, setUploadAIChats] = useState<string>("true")

    return (
        <div className="flex flex-col gap-2">
            <select
                value={uploadAIChats}
                onChange={(e) => {
                    setUploadAIChats(e.target.value)
                }}
                className="w-full h-10 rounded-md border-2 border-foreground-200 bg-foreground-100 text-foreground-600 focus:outline-none focus:border-purple-500"
            >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
            </select>
        </div>
    )
}

function DefaultSortTypeSetting() {
    const user = useUser()!
    const [defaultSortType, setDefaultSortType] = useState<"starred" | "unstarred" | "all">("starred")

    return (
        <div className="flex flex-col gap-2">
            <select
                value={defaultSortType}
                onChange={(e) => {
                    setDefaultSortType(e.target.value as "starred" | "unstarred" | "all")
                }}
                className="w-full h-10 rounded-md border-2 border-foreground-200 bg-foreground-100 text-foreground-600 focus:outline-none focus:border-purple-500"
            >
                <option value="starred">Starred</option>
                <option value="unstarred">Unstarred</option>
                <option value="all">All</option>
            </select>
        </div>
    )
}

function DefaultChatSidepanelSetting() {
    const user = useUser()!
    const [defaultChatSidepanel, setDefaultChatSidepanel] = useState<string>("false")

    return (
        <div className="flex flex-col gap-2">
            <select
                value={defaultChatSidepanel}
                onChange={(e) => {
                    setDefaultChatSidepanel(e.target.value === 'true')
                }}
                className="w-full h-10 rounded-md border-2 border-foreground-200 bg-foreground-100 text-foreground-600 focus:outline-none focus:border-purple-500"
            >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
            </select>
        </div>
    )
}

function DefaultSortTypeUpdatesSetting() {
    const user = useUser()!
    const [defaultSortTypeUpdates, setDefaultSortTypeUpdates] = useState<string>("recent")

    return (
        <div className="flex flex-col gap-2">
            <select
                value={defaultSortTypeUpdates}
                onChange={(e) => {
                    setDefaultSortTypeUpdates(e.target.value)
                }}
                className="w-full h-10 rounded-md border-2 border-foreground-200 bg-foreground-100 text-foreground-600 focus:outline-none focus:border-purple-500"
            >
                <option value="recent">Recent</option>
                <option value="alphabetical">Alphabetical</option>
            </select>
        </div>
    )
}

function RefreshAccessTokenIntervalSetting() {
    const [refreshAccessTokenInterval, setRefreshAccessTokenInterval] = useState<number>(1000 * 60 * 45)

    return (
        <div className="flex flex-col gap-2">
            <Input
                value={refreshAccessTokenInterval}
                onChange={(e) => {
                    setRefreshAccessTokenInterval(parseInt(e.target.value))
                    // updateUser({ RefreshAccessTokenInterval: parseInt(e.target.value) })
                }}
                className="w-full h-10 rounded-md border-2 border-foreground-200 bg-foreground-100 text-foreground-600 focus:outline-none focus:border-purple-500"
            />
        </div>
    )
}

function SettingsSidebar({ currentSection, rootRef }: { currentSection: string, rootRef: React.RefObject<HTMLDivElement> }) {
    const navRef = React.useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

    const navDividerSettings = {
        orientation: isMobile ? 'vertical' : 'horizontal',
        className: isMobile ? 'h-6' : ''
    } satisfies DividerProps

    const SettingsNavTitleSettings = {
        currentSection,
        navbarRef: navRef,
        rootRef: rootRef,
        isMobile: isMobile
    } satisfies Omit<SettingsNavTitleProps, 'title' | 'icon'>

    useEffect(() => {
        window.addEventListener('resize', () => {
            setIsMobile(window.innerWidth < 768)
        })

        return () => {
            window.removeEventListener('resize', () => {
                setIsMobile(window.innerWidth < 768)
            })
        }
    }, [])
    return (
        <nav
            className={"flex md:flex-col flex-row gap-4 md:gap-2 w-full md:w-1/6 p-2 min-w-[20vw] overflow-x-auto md:overflow-y-auto"}
            ref={navRef}>
            <SettingsNavTitle title={"Preferences"}
                icon={<SettingsIcon />} {...SettingsNavTitleSettings} />
            <Divider {...navDividerSettings} />
        </nav>
    )
}

function ThemeChangeButton({ theme }: { theme: string }) {
    const { setTheme, theme: currentTheme } = useTheme()

    const ThemeIconClassName = 'w-6 h-6 text-foreground'
    return (
        <Button
            onClick={() => {
                setTheme(theme)
            }}
            className={cn('w-full md:w-auto border-2 border-transparent', currentTheme === theme ? 'bg-foreground-100 text-foreground border-2 border-purple-500' : 'bg-foreground-200 text-foreground-200')}
            variant={"ghost"}
            size={"lg"}
        >
            {theme === 'light' && <SunIcon className={ThemeIconClassName} />}
            {theme === 'dark' && <MoonIcon className={ThemeIconClassName} />}
            {theme === 'system' && <ComputerIcon className={ThemeIconClassName} />}
        </Button>
    )
}

function SettingsCardSection({ title, children, setCurrentSection, root }: {
    title: string,
    children?: React.ReactNode,
    setCurrentSection?: React.Dispatch<SetStateAction<string>>,
    root?: React.RefObject<HTMLDivElement>
}) {
    const [ref, entry] = useIntersectionObserver({
        threshold: 0,
        root: root?.current,
    })

    useEffect(() => {
        if (entry?.isIntersecting) {
            setCurrentSection?.(title)
        }
    }, [entry, setCurrentSection, title]);

    return (
        <div className={"p-4 md:p-8 bg-foreground-100 rounded-xl shadow-md w-full h-max"}>
            <h1 data-title={title} ref={ref} className={"py-2 text-2xl font-bold text-foreground"}>{title}</h1>
            <div className={"flex flex-col gap-4 w-full h-full"}>
                {children}
            </div>
        </div>
    )
}

interface SettingsNavTitleProps {
    currentSection: string,
    title: string,
    navbarRef?: React.RefObject<HTMLDivElement>
    rootRef?: React.RefObject<HTMLDivElement>
    isMobile?: boolean
    icon?: React.ReactNode
}

function SettingsNavTitle({ currentSection, title, navbarRef, rootRef, isMobile, icon }: SettingsNavTitleProps) {
    const ref = React.useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        if (ref.current && currentSection === title) {
            navbarRef?.current?.scrollTo({
                left: ref.current.offsetLeft - 50,
                behavior: 'smooth'
            })
        }
    }, [currentSection, navbarRef, title])

    return (
        <h6
            onClick={() => {
                const element = document.querySelector(`[data-title="${title}"]`)
                if (element) {
                    // get the element's position relative to the viewport of the ref
                    if (rootRef && rootRef.current) {
                        const top = element.getBoundingClientRect().top - rootRef?.current?.getBoundingClientRect().top! - 50
                        // scroll by the amount of top
                        rootRef?.current?.scrollBy({
                            top,
                            behavior: 'smooth'
                        })
                    }
                }
            }}
            ref={ref}
            className={"overflow-hidden inline-flex gap-2 text-foreground data-[active=true]:text-foreground data-[active=true]:font-bold hover:text-foreground cursor-pointer hover:font-bold transition-all duration-200 hover:drop-shadow-[0_0px_5px_rgba(100,100,100,0.5)]"}
            data-active={currentSection === title}
        >
            <span className="shrink-0">{!isMobile && icon} {title}</span>
        </h6>
    )
}