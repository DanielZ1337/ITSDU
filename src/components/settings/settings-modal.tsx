import { Divider } from "@nextui-org/divider";
import { useIntersectionObserver } from "@uidotdev/usehooks"
import React, { SetStateAction, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button, DividerProps, ScrollShadow } from "@nextui-org/react";
import {
    AlertTriangle,
    ComputerIcon,
    CookieIcon,
    MoonIcon,
    PencilIcon,
    SettingsIcon,
    SunIcon,
    User as UserIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { Spinner } from "@nextui-org/spinner";
import { useUser } from '@/hooks/atoms/useUser.ts'
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal.ts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from "../ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Page() {

    const { showSettingsModal, setShowSettingsModal } = useShowSettingsModal()

    return (
        <Dialog
            open={showSettingsModal}
            onOpenChange={setShowSettingsModal}
        >
            <DialogOverlay />
            <DialogContent
                className="md:w-fit max-w-[90vw] max-h-[90vh]"
            >
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>Configure your preferences</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>

            </DialogContent>
        </Dialog>
    )
}

function SettingsCustom() {
    const [currentSection, setCurrentSection] = useState<string>('')
    const rootRef = React.useRef<HTMLDivElement>(null)
    const navRef = React.useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)
    const { setTheme, theme } = useTheme()
    const user = useUser()!

    const navDividerSettings = {
        orientation: isMobile ? 'vertical' : 'horizontal',
        className: cn(isMobile ? 'h-6' : '')
    } satisfies DividerProps

    const SettingsNavTitleSettings = {
        currentSection,
        navbarRef: navRef,
        rootRef: rootRef,
        isMobile: isMobile
    }

    const SettingsCardSectionSettings = {
        root: rootRef,
        setCurrentSection: setCurrentSection
    }

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
        <div
            className={"flex flex-col gap-4 items-center w-full h-full p-4 lg:p-8 bg-foreground-50 rounded-xl"}>
            <div className={"flex md:flex-row flex-col gap-4 w-full"}>
                <nav
                    className={"flex md:flex-col flex-row gap-4 md:gap-2 w-full md:w-1/6 px-2 md:px-0 overflow-x-auto md:overflow-y-auto"}
                    ref={navRef}>
                    <SettingsNavTitle title={"Profile"} icon={<UserIcon />}  {...SettingsNavTitleSettings} />
                    <Divider {...navDividerSettings} />
                    <SettingsNavTitle title={"Preferences"}
                        icon={<SettingsIcon />} {...SettingsNavTitleSettings} />
                    <Divider {...navDividerSettings} />
                    <SettingsNavTitle title={"Cookie Settings"}
                        icon={<CookieIcon />} {...SettingsNavTitleSettings} />
                    <Divider {...navDividerSettings} />
                    <SettingsNavTitle title={"Danger Zone"}
                        icon={<AlertTriangle />} {...SettingsNavTitleSettings} />
                </nav>
                <Divider orientation={"vertical"} className={"hidden md:block h-[55vh]"} />
                <ScrollShadow hideScrollBar
                    className={"flex flex-col gap-4 w-full h-[55vh] py-2 overflow-y-auto"}
                    ref={rootRef}>
                    <SettingsCardSection title={"Profile"} {...SettingsCardSectionSettings}>
                        <div className={"flex flex-col gap-4 w-full"}>
                            <div className={"flex flex-col gap-2"}>
                                <h6 className={"text-shdcnmuted-shdcnforeground"}>Profile Picture</h6>
                                <Avatar src={user.ProfileImageUrl}
                                    className={"border-[4px] border-secondary h-auto xl:w-[100px] md:w-[100px] w-[80px] lg:w-[100px]"}
                                    alt={user.FullName} />
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h6 className={"text-shdcnmuted-shdcnforeground"}>Name</h6>
                                <span
                                    className={"inline-flex items-center py-1 rounded-md text-sm font-medium bg-foreground-100 text-foreground"}>
                                    <h1 className={"text-foreground"}>{user.FullName}</h1>
                                    <div
                                        className={"ml-2 p-2 rounded-full hover:bg-foreground-200 cursor-pointer"}>
                                        <PencilIcon className={"w-4 h-4"} />
                                    </div>
                                </span>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h6 className={"text-shdcnmuted-shdcnforeground"}>Person ID</h6>
                                <span
                                    className={"inline-flex items-center py-1 rounded-md text-sm font-medium bg-foreground-100 text-foreground"}>
                                    <h1 className={"text-foreground"}>{user.PersonId}</h1>
                                    <div
                                        className={"ml-2 p-2 rounded-full hover:bg-foreground-200 cursor-pointer"}>
                                        <PencilIcon className={"w-4 h-4"} />
                                    </div>
                                </span>
                            </div>
                            {/* <UploadDropzone
                                    className={"cursor-pointer border-dashed border-2 border-foreground-600"}
                                    appearance={{
                                        button: "bg-foreground-100 text-foreground hover:bg-foreground-200 hover:text-foreground px-4 py-2 rounded-md transition-all duration-200",
                                    }}
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                                // Do something with the response
                                        console.log("Files: ", res);
                                        alert("Upload Completed");
                                        update({image: res?.[0].fileUrl}).then(() => {
                                            update().then(() => {
                                                alert('Profile picture updated! You will be logged out to refresh the changes for you.')
                                                signOut().then(() => {
                                                    signIn()
                                                })
                                            })
                                        })
                                    }}
                                    onUploadError={(error: Error) => {
                                        // Do something with the error.
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                /> */}
                        </div>
                    </SettingsCardSection>
                    <SettingsCardSection title={"Preferences"} {...SettingsCardSectionSettings}>
                        <div className={"flex flex-col gap-4 w-full"}>
                            <div className={"flex flex-col gap-2"}>
                                <h6 className={"text-shdcnmuted-shdcnforeground"}>Dark Mode</h6>
                                <div className={"flex flex-row gap-2 w-full justify-between md:justify-start"}>
                                    <Button
                                        onClick={() => {
                                            setTheme('light')
                                        }}
                                        className={cn(theme === 'light' ? 'bg-foreground-100 text-foreground border-2 border-secondary-600' : 'bg-foreground-200 text-foreground-200', isMobile && 'w-full')}
                                        variant={"flat"}
                                        radius={"sm"}
                                        size={"lg"}
                                    >
                                        <SunIcon className={"w-6 h-6 text-foreground"} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setTheme('dark')
                                        }}
                                        className={cn(theme === 'dark' ? 'bg-foreground-100 text-foreground border-2 border-secondary-600' : 'bg-foreground-200 text-foreground-200', isMobile && 'w-full')}
                                        variant={"flat"}
                                        radius={"sm"}
                                        size={"lg"}
                                    >
                                        <MoonIcon className={"w-6 h-6 text-foreground"} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setTheme('system')
                                        }}
                                        className={cn(theme === 'system' ? 'bg-foreground-100 text-foreground border-2 border-secondary-600' : 'bg-foreground-200 text-foreground-200', isMobile && 'w-full')}
                                        variant={"flat"}
                                        radius={"sm"}
                                        size={"lg"}
                                    >
                                        <ComputerIcon className={"w-6 h-6 text-foreground"} />
                                    </Button>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h6 className={"text-shdcnmuted-shdcnforeground"}>Language</h6>
                                <h1 className={"text-foreground"}>Coming Soon</h1>
                            </div>
                        </div>
                    </SettingsCardSection>
                    <SettingsCardSection title={"Danger Zone"} {...SettingsCardSectionSettings}>
                        <div className={"flex flex-col gap-4 w-full"}>
                            <div className={"flex flex-col gap-2"}>
                                <h6 className={"text-shdcnmuted-shdcnforeground"}>Delete Account</h6>
                                <Button
                                    onClick={() => {
                                        alert('Coming Soon')
                                    }}
                                    className={"w-full md:w-1/2 my-4 md:mb-0"}
                                    spinner={<Spinner color={"current"} size={"sm"} />}
                                    size={"lg"}
                                    color={"danger"}
                                    variant={"ghost"}
                                    isDisabled
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </SettingsCardSection>
                </ScrollShadow>
            </div>
        </div>
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

function SettingsNavTitle({ currentSection, title, navbarRef, rootRef, isMobile, icon }: {
    currentSection: string,
    title: string,
    navbarRef?: React.RefObject<HTMLDivElement>
    rootRef?: React.RefObject<HTMLDivElement>
    isMobile?: boolean
    icon?: React.ReactNode
}) {
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
            className={"inline-flex gap-2 text-shdcnmuted-shdcnforeground data-[active=true]:text-foreground data-[active=true]:font-bold hover:text-foreground cursor-pointer hover:font-bold transition-all duration-200 hover:drop-shadow-[0_0px_5px_rgba(100,100,100,0.5)]"}
            data-active={currentSection === title}
        >
            {!isMobile && icon} {title}
        </h6>
    )
}