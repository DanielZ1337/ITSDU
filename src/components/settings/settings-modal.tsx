import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/atoms/useSettings";
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal.ts";
import { useUser } from "@/hooks/atoms/useUser.ts";
import { useMeasureScrollPosition } from "@/hooks/useMeasureScrollPosition";
import { getSortedResourcesByTime } from "@/lib/resource-indexeddb/resource-indexeddb-utils";
import {
	IndexedDBResourceFileType,
	ItsduResourcesDBWrapper,
} from "@/lib/resource-indexeddb/resourceIndexedDB";
import { cn } from "@/lib/utils";
import { Divider } from "@nextui-org/divider";
import { DividerProps } from "@nextui-org/react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import {
	ChevronDown,
	ComputerIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LanguageCombobox } from "../language-combobox";
import {
	Shadow,
	ShadowPosition,
	calculateShadowPosition,
} from "../scroll-shadow";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";
import SettingsCloseButton from "./settings-close-button";

export default function SettingsModal() {
	const { showSettingsModal, setShowSettingsModal } = useShowSettingsModal();

	return (
		<Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
			<DialogOverlay className="will-change-auto data-[state=open]:!bg-black/10 data-[state=closed]:!bg-black/0 transition-all data-[state=open]:!duration-500" />
			<DialogContent
				customClose={<SettingsCloseButton />}
				className="flex flex-1 flex-col h-screen w-screen md:w-screen max-w-full rounded-none md:rounded-none overflow-hidden focus:outline-none bg-neutral-100 dark:bg-neutral-800 data-[state=open]:!zoom-in-125 data-[state=closed]:!zoom-out-125 transition-none p-0 gap-0"
			>
				<div className="absolute h-14 w-full bg-transparent drag" />
				<div className="flex h-full w-full flex-col items-center justify-center gap-4 px-10 py-14">
					{/* <SettingsCustom /> */}
					<Tabs defaultValue="settings" className="w-full h-full">
						<TabsList className="bg-transparent absolute top-1/2 left-[10%] transform -translate-y-1/2 flex flex-col gap-4 items-center">
							<TabsTrigger
								value="settings"
								className={buttonVariants({
									variant: "link",
									className:
										"bg-transparent data-[state=active]:bg-transparent data-[state=inactive]:text-foreground-500 text-lg data-[state=active]:text-foreground data-[state=active]:shadow-sm",
								})}
							>
								Settings
							</TabsTrigger>
							<TabsTrigger
								value="indexeddb"
								className={buttonVariants({
									variant: "link",
									className:
										"bg-transparent data-[state=active]:bg-transparent data-[state=inactive]:text-foreground-500 text-lg data-[state=active]:text-foreground data-[state=active]:shadow-sm",
								})}
							>
								IndexedDB
							</TabsTrigger>
						</TabsList>
						<TabsContent
							value="settings"
							className="focus-visible:ring-0 focus-visible:ring-offset-0 h-full w-full overflow-hidden"
						>
							<SettingsCustom />
						</TabsContent>
						<TabsContent
							value="indexeddb"
							className="focus-visible:ring-0 focus-visible:ring-offset-0 h-full w-full overflow-hidden"
						>
							<ErrorBoundary
								fallback={
									<div className="flex flex-col gap-4 items-center w-full h-full p-4 lg:p-8  rounded-xl">
										<h1 className="text-foreground">Error</h1>
										<h2 className="text-foreground">
											An error occured while loading IndexedDB. Please try again
											later.
										</h2>
									</div>
								}
								onError={() => {
									toast({
										title: "Error",
										variant: "destructive",
										description:
											"An error occured while loading IndexedDB. Please try again later.",
									});
								}}
							>
								<IndexedDB />
							</ErrorBoundary>
						</TabsContent>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function ResizablePanelSettings({ panelId }: { panelId: string }) {
	const localStorageKey = `react-resizable-panels:${panelId}`;

	const [panelSettings, setPanelSettings] = useState([70, 30]);

	useEffect(() => {
		const storedSettings = localStorage.getItem(localStorageKey);
		if (storedSettings) {
			const parsedSettings = JSON.parse(storedSettings);
			const layout = parsedSettings[Object.keys(parsedSettings)[0]].layout;
			setPanelSettings(layout);
		}
	}, [localStorageKey]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setPanelSettings({ ...panelSettings, [name]: value });
	};

	const clearLocalStorage = () => {
		localStorage.removeItem(localStorageKey);
	};

	const saveSettings = () => {
		localStorage.setItem(localStorageKey, JSON.stringify(panelSettings));
	};

	return (
		<div>
			<h2>{`Resizable Panel ${panelId} Settings`}</h2>
			{/* <div className="py-2">
                <div>
                    <label htmlFor={`${panelId}-layout`}>Layout</label>
                    <input
                        id={`${panelId}-layout`}
                        name="layout"
                        type="text"
                        value={panelSettings.map(String)}
                        onChange={handleInputChange}
                    />
                </div>
                <div>

                </div>
            </div>
            <Button variant={"outline"} onClick={saveSettings}>Save Settings</Button> */}
			<Button variant={"outline"} onClick={clearLocalStorage}>
				Clear Settings
			</Button>
		</div>
	);
}

function SettingsCustom() {
	const [currentSection, setCurrentSection] = React.useState<string>("account");
	const [currentHover, setCurrentHover] = React.useState<string | null>(null);

	const memoizedCurrentSection = React.useMemo(
		() => currentSection,
		[currentSection],
	);
	const memoizedCurrentHover = React.useMemo(
		() => currentHover,
		[currentHover],
	);
	const rootRef = React.useRef<HTMLDivElement>(null);
	const viewportRef = React.useRef<HTMLDivElement>(null);

	const SettingsCardSectionSettings = {
		root: rootRef,
		setCurrentSection: setCurrentSection,
	};

	const [shadowPosition, setShadowPosition] = useState<ShadowPosition>(
		calculateShadowPosition(viewportRef),
	);
	useMeasureScrollPosition(viewportRef, (position) =>
		setShadowPosition(position),
	);

	const { settings } = useSettings();

	return (
		<div
			className={
				"flex flex-col gap-4 items-center w-full h-full p-4 lg:p-8  rounded-xl"
			}
		>
			{/* <SettingsSidebar currentSection={currentSection} rootRef={rootRef} /> */}
			<Tabs
				defaultValue={currentSection}
				value={currentSection}
				onValueChange={setCurrentSection}
				orientation="vertical"
				className="flex h-full w-full flex-col gap-4 md:flex-row"
			>
				{/* <TabsList
                    className="flex h-full flex-row justify-start gap-4 overflow-x-auto bg-neutral-100 p-2 min-w-[20vw] max-w-[30vw] dark:bg-neutral-800 md:flex-col md:gap-2 md:overflow-y-auto">
                    <h1 className="my-2 text-xl font-bold text-neutral-400 text-foreground">Settings</h1>
                    <Divider orientation={"horizontal"} className={"hidden md:block h-1 mb-4"} />
                    <SettingsSidebarButton
                        currentSection={memoizedCurrentSection}
                        value="Preferences"
                        label="Preferences"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                    <SettingsSidebarButton
                        currentSection={memoizedCurrentSection}
                        value="account"
                        label="Account"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                    <SettingsSidebarButton
                        currentSection={memoizedCurrentSection}
                        value="password"
                        label="Password"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                </TabsList>
                <Divider orientation={"vertical"} className={"hidden md:block h-full"} /> */}
				<ScrollArea
					className={
						"w-1/2 mx-auto overflow-y-auto relative rounded-l-md transition-all duration-75"
					}
					// scrollbarClassName="absolute"
					thumbClassName="bg-neutral-200 dark:bg-neutral-700"
					ref={rootRef}
					viewportRef={viewportRef}
					style={{
						borderTopRightRadius: shadowPosition === "bottom" ? 5 : 10,
						borderBottomRightRadius: shadowPosition === "top" ? 5 : 10,
					}}
				>
					<SettingsCardSection
						title="Preferences"
						{...SettingsCardSectionSettings}
					>
						<div className="flex w-full flex-col gap-4">
							{/* {JSON.stringify(settings)} */}
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
								<h6 className="text-foreground">
									Enable/Disable Uploading AI Chats
								</h6>
								<UploadAIChatsSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">
									Default Sort Type for Course Cards
								</h6>
								<DefaultSortTypeSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">Default AI Chat Sidepanel</h6>
								<DefaultAIChatSidepanelSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">
									Default Sort Type for Updates
								</h6>
								<DefaultSortTypeUpdatesSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">
									Interval for Refreshing Access Tokens (in ms)
								</h6>
								<RefreshAccessTokenIntervalSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">Custom Titlebar Buttons</h6>
								<CustomTitlebarButtons />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">Custom Titlebar</h6>
								<CustomTitlebarSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">Default Resource Open Type</h6>
								<DefaultResourceOpenTypeSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">
									Default Resource Table Columns
								</h6>
								<DefaultResourceTableColumnsSetting />
							</div>
							<div className="flex flex-col gap-2">
								<h6 className="text-foreground">Resizeable Panel Settings</h6>
								<ResizablePanelSettings panelId={"course-index"} />
							</div>
						</div>
					</SettingsCardSection>
					<Shadow position={shadowPosition} />
				</ScrollArea>
			</Tabs>
		</div>
	);
}

function IndexedDB() {
	const [currentSection, setCurrentSection] = React.useState<string>("account");
	const [currentHover, setCurrentHover] = React.useState<string | null>(null);

	const memoizedCurrentSection = React.useMemo(
		() => currentSection,
		[currentSection],
	);
	const memoizedCurrentHover = React.useMemo(
		() => currentHover,
		[currentHover],
	);
	const rootRef = React.useRef<HTMLDivElement>(null);
	const viewportRef = React.useRef<HTMLDivElement>(null);

	const SettingsCardSectionSettings = {
		root: rootRef,
		setCurrentSection: setCurrentSection,
	};

	const [shadowPosition, setShadowPosition] = useState<ShadowPosition>(
		calculateShadowPosition(viewportRef),
	);
	useMeasureScrollPosition(viewportRef, (position) =>
		setShadowPosition(position),
	);

	const { settings } = useSettings();
	const [indexedDBResources, setIndexedDBResources] =
		useState<ItsduResourcesDBWrapper | null>(null);
	const [allResources, setAllResources] = useState<
		IndexedDBResourceFileType[] | null
	>([]);
	const [coursesDropdown, setCoursesDropdown] = useState<string[]>([]);
	const [selectedCourses, setSelectedCourses] = useState<string[] | null>(null);
	const [filteredResources, setFilteredResources] = useState<
		IndexedDBResourceFileType[]
	>([]);

	let courses: any = null;
	const formatSize = (size: number) => {
		if (size < 1024) {
			return `${size} B`;
		} else if (size < 1024 * 1024) {
			return `${Math.floor(size / 1024)} KB`;
		} else if (size < 1024 * 1024 * 1024) {
			return `${Math.floor(size / 1024 / 1024)} MB`;
		} else {
			return `${Math.floor(size / 1024 / 1024 / 1024)} GB`;
		}
	};

	let totalSize = useCallback(
		() =>
			allResources &&
			formatSize(
				allResources.reduce((acc, resource) => acc + resource.size, 0),
			),
		[allResources],
	)();
	let filteredTotalSize = useCallback(
		() =>
			formatSize(
				filteredResources.reduce((acc, resource) => acc + resource.size, 0),
			),
		[filteredResources],
	)();

	if (allResources) {
		courses = allResources.reduce((acc: any, resource) => {
			const { CourseId, CourseTitle } = resource;
			acc[CourseId] = {
				CourseId,
				CourseTitle,
			};
			return acc;
		}, {});
	}

	useEffect(() => {
		ItsduResourcesDBWrapper.getInstance().then((instance) => {
			setIndexedDBResources(instance);
		});
	}, []);

	useEffect(() => {
		if (indexedDBResources && allResources?.length === 0) {
			indexedDBResources.getAllResources().then((resources) => {
				resources = getSortedResourcesByTime(resources);
				setAllResources(resources);
			});
		}
	}, [indexedDBResources, allResources?.length]);

	useEffect(() => {
		if (allResources) {
			const uniqueCourses = Array.from(
				new Set(allResources.map((resource) => String(resource.CourseId))),
			);
			setCoursesDropdown(uniqueCourses);
			setSelectedCourses(uniqueCourses);
		}
	}, [allResources?.length]);

	const handleCourseSelect = useCallback(
		(courseId: string) => {
			// check if the course is already selected
			const isSelected = selectedCourses?.includes(courseId);

			if (isSelected) {
				// remove the course from the selected courses
				setSelectedCourses(
					selectedCourses?.filter((id) => id !== courseId) || null,
				);
			} else {
				// add the course to the selected courses
				setSelectedCourses((selectedCourses || []).concat(courseId));
			}
		},
		[selectedCourses],
	);

	useEffect(() => {
		// Filter resources when selectedCourse changes
		if (selectedCourses && allResources) {
			const filtered = allResources.filter((resource) => {
				return selectedCourses.includes(String(resource.CourseId));
			});
			setFilteredResources(filtered);
		} else {
			setFilteredResources(allResources || []);
		}
	}, [selectedCourses, allResources]);

	const handleDeleteResource = (resourceId: string) => {
		indexedDBResources?.deleteResourceById(resourceId).then(() => {
			indexedDBResources?.getAllResources().then((resources) => {
				resources = getSortedResourcesByTime(resources);
				setAllResources(resources);
			});
		});
	};

	const handleDeleteAllResourcesForFilteredCourses = () => {
		const filteredResourcesIds = allResources?.map(
			(resource) => resource.elementId,
		);

		const filteredResourcesIdsToDelete = filteredResourcesIds?.filter(
			(resourceId) => {
				return filteredResources?.some(
					(resource) =>
						selectedCourses?.includes(String(resource.CourseId)) &&
						resource.elementId === resourceId,
				);
			},
		);

		filteredResourcesIdsToDelete?.forEach((resourceId) => {
			indexedDBResources?.deleteResourceById(resourceId);
		});

		indexedDBResources?.getAllResources().then((resources) => {
			resources = getSortedResourcesByTime(resources);
			setAllResources(resources);
		});
	};

	return (
		<div
			className={
				"flex flex-col gap-4 items-center w-full h-full p-4 lg:p-8  rounded-xl"
			}
		>
			{/* <SettingsSidebar currentSection={currentSection} rootRef={rootRef} /> */}
			<Tabs
				defaultValue={currentSection}
				value={currentSection}
				onValueChange={setCurrentSection}
				orientation="vertical"
				className="flex h-full w-full flex-col gap-4 md:flex-row"
			>
				{/* <TabsList
                    className="flex h-full flex-row justify-start gap-4 overflow-x-auto bg-neutral-100 p-2 min-w-[20vw] max-w-[30vw] dark:bg-neutral-800 md:flex-col md:gap-2 md:overflow-y-auto">
                    <h1 className="my-2 text-xl font-bold text-neutral-400 text-foreground">Settings</h1>
                    <Divider orientation={"horizontal"} className={"hidden md:block h-1 mb-4"} />
                    <SettingsSidebarButton
                        currentSection={memoizedCurrentSection}
                        value="Preferences"
                        label="Preferences"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                    <SettingsSidebarButton
                        currentSection={memoizedCurrentSection}
                        value="account"
                        label="Account"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                    <SettingsSidebarButton
                        currentSection={memoizedCurrentSection}
                        value="password"
                        label="Password"
                        currentHover={memoizedCurrentHover}
                        setCurrentHover={setCurrentHover}
                    />
                </TabsList>
                <Divider orientation={"vertical"} className={"hidden md:block h-full"} /> */}
				<ScrollArea
					className={
						"w-1/2 mx-auto overflow-y-auto relative rounded-l-md transition-all duration-75"
					}
					// scrollbarClassName="absolute"
					thumbClassName="bg-neutral-200 dark:bg-neutral-700"
					ref={rootRef}
					viewportRef={viewportRef}
					style={{
						borderTopRightRadius: shadowPosition === "bottom" ? 5 : 10,
						borderBottomRightRadius: shadowPosition === "top" ? 5 : 10,
					}}
				>
					<SettingsCardSection
						title="Preferences"
						{...SettingsCardSectionSettings}
					>
						<div className="flex w-full flex-col gap-4">
							{/* {JSON.stringify(settings)} */}
							<div className="flex flex-row gap-2 w-full justify-between items-center">
								<div className="flex flex-col gap-2">
									<h6 className="text-foreground">All Resources</h6>
									<span className="text-foreground">
										Total Size: {totalSize}
									</span>
									<Button
										variant={"outline"}
										onClick={() => {
											indexedDBResources?.clearResources().then(() => {
												setAllResources([]);
											});
										}}
									>
										Delete All
									</Button>
								</div>
								<div className="flex flex-col gap-2">
									<h6 className="text-foreground">Filtered Resources</h6>
									<span className="text-foreground">
										Total Size: {filteredTotalSize}
									</span>
									<Button
										variant={"outline"}
										onClick={handleDeleteAllResourcesForFilteredCourses}
									>
										Delete All
									</Button>
								</div>
							</div>
							{coursesDropdown && coursesDropdown.length > 0 && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="ml-auto scale-100 select-none active:scale-100"
										>
											Columns <ChevronDown className="ml-2 h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{coursesDropdown.map((courseId) => {
											return (
												<DropdownMenuCheckboxItem
													key={courseId}
													className="capitalize"
													checked={selectedCourses?.includes(courseId)}
													onCheckedChange={() => handleCourseSelect(courseId)}
												>
													{courses[courseId]?.CourseTitle}
												</DropdownMenuCheckboxItem>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
							)}
							<div className="flex flex-col gap-2">
								{filteredResources?.map((resource) => {
									return (
										<div
											key={resource.elementId}
											className="grid grid-cols-2 gap-2 w-full"
										>
											<div className="flex flex-col gap-2 w-full">
												<span className="text-foreground">
													{resource.CourseTitle}
												</span>
												<span className="text-foreground">
													{resource.CourseId}
												</span>
												<span className="text-foreground">
													{resource.elementId}
												</span>
												<span className="text-foreground">{resource.name}</span>
												<span className="text-foreground">{resource.type}</span>
												<span className="text-foreground">
													Last accessed: {resource.last_accessed.toDateString()}
												</span>
												<span className="text-foreground">
													Size: {formatSize(resource.size)}
												</span>
											</div>
											<div className="flex flex-col gap-2 w-full">
												<Button
													variant={"outline"}
													onClick={() => {
														handleDeleteResource(resource.elementId);
													}}
												>
													Delete
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</SettingsCardSection>
				</ScrollArea>
			</Tabs>
		</div>
	);
}

function DarkModeSetting() {
	const { theme } = useTheme();

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
	);
}

function LanguageSetting() {
	const user = useUser()!;
	const [language, setLanguage] = useState<string>(user.Language);

	useEffect(() => {
		setLanguage(user.Language);
	}, [user.Language]);

	return <LanguageCombobox disabled />;
}

function DefaultHomePageSetting() {
	const [defaultHomePage, setDefaultHomePage] = useState<string>("index");

	return (
		<Select value={defaultHomePage} onValueChange={setDefaultHomePage} disabled>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="Theme" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="index">Index</SelectItem>
				<SelectItem value="dashboard">Dashboard</SelectItem>
				<SelectItem value="courses">Courses</SelectItem>
				<SelectItem value="calendar">Calendar</SelectItem>
				<SelectItem value="messages">Messages</SelectItem>
				<SelectItem value="settings">Settings</SelectItem>
			</SelectContent>
		</Select>
	);
}

function CustomPDFRendererSetting() {
	const { settings, updateSettings } = useSettings();

	return (
		<Select
			value={settings.CustomPDFrenderer.toString()}
			onValueChange={(e) => updateSettings({ CustomPDFrenderer: e === "true" })}
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="Custom PDF Renderer" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="true">Enabled</SelectItem>
				<SelectItem value="false">Disabled</SelectItem>
			</SelectContent>
		</Select>
	);
}

function UploadAIChatsSetting() {
	const { settings, updateSettings } = useSettings();

	return (
		<Select
			value={settings.UploadAIChats.toString()}
			onValueChange={(e) => updateSettings({ UploadAIChats: e === "true" })}
			disabled
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="AI Chat Upload" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="true">Enabled</SelectItem>
				<SelectItem value="false">Disabled</SelectItem>
			</SelectContent>
		</Select>
	);
}

function CustomTitlebarButtons() {
	const { settings, updateSettings } = useSettings();

	return (
		<Select
			value={settings.CustomTitleBarButtons.toString()}
			onValueChange={(e) =>
				updateSettings({ CustomTitleBarButtons: e === "true" })
			}
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="Titlebar Buttons" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="true">Enabled</SelectItem>
				<SelectItem value="false">Disabled</SelectItem>
			</SelectContent>
		</Select>
	);
}

function CustomTitlebarSetting() {
	const { settings, updateSettings } = useSettings();

	return (
		<Select
			value={settings.CustomTitleBar.toString()}
			onValueChange={(e) => updateSettings({ CustomTitleBar: e === "true" })}
			disabled
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="Titlebar" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="true">Enabled</SelectItem>
				<SelectItem value="false">Disabled</SelectItem>
			</SelectContent>
		</Select>
	);
}

function DefaultSortTypeSetting() {
	const [defaultSortType, setDefaultSortType] = useState<
		"starred" | "unstarred" | "all"
	>("starred");

	return (
		<Select
			value={defaultSortType}
			onValueChange={(e) => {
				setDefaultSortType(e as "starred" | "unstarred" | "all");
			}}
			disabled
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="Theme" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="starred">Starred</SelectItem>
				<SelectItem value="unstarred">Unstarred</SelectItem>
				<SelectItem value="all">All</SelectItem>
			</SelectContent>
		</Select>
	);
}

function DefaultAIChatSidepanelSetting() {
	const { settings, updateSettings } = useSettings();

	return (
		<Select
			value={settings.DefaultAIChatSidepanel.toString()}
			onValueChange={(e) =>
				updateSettings({ DefaultAIChatSidepanel: e === "true" })
			}
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="AI Chat Sidepanel" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="true">Enabled</SelectItem>
				<SelectItem value="false">Disabled</SelectItem>
			</SelectContent>
		</Select>
	);
}

function DefaultSortTypeUpdatesSetting() {
	const [defaultSortTypeUpdates, setDefaultSortTypeUpdates] = useState<
		"all" | "updates" | "announcements"
	>("all");

	return (
		<Select
			value={defaultSortTypeUpdates}
			onValueChange={(e) => {
				setDefaultSortTypeUpdates(e as "all" | "updates" | "announcements");
			}}
			disabled
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="Theme" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="all">All</SelectItem>
				<SelectItem value="updates">Updates</SelectItem>
				<SelectItem value="announcements">Announcements</SelectItem>
			</SelectContent>
		</Select>
	);
}

function DefaultResourceOpenTypeSetting() {
	type DefaultResourceOpenType = "external" | "internal";
	const [defaultResourceOpenType, setDefaultResourceOpenType] =
		useState<DefaultResourceOpenType>("external");

	return (
		<Select
			value={defaultResourceOpenType}
			onValueChange={(e) => {
				setDefaultResourceOpenType(e as DefaultResourceOpenType);
			}}
			disabled
		>
			<SelectTrigger className="border-2 border-transparent border-purple-500 text-white w-[180px] text-foreground bg-foreground-200">
				<SelectValue placeholder="Theme" />
			</SelectTrigger>
			<SelectContent className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200">
				<SelectItem value="external">External</SelectItem>
				<SelectItem value="internal">Internal</SelectItem>
			</SelectContent>
		</Select>
	);
}

function DefaultResourceTableColumnsSetting() {
	// columns are type, title and published. They can all be toggled on and off at the same time
	type DefaultResourceTableColumns = {
		type: boolean;
		title: boolean;
		published: boolean;
	};

	const [defaultResourceTableColumns, setDefaultResourceTableColumns] =
		useState<DefaultResourceTableColumns>({
			type: true,
			title: true,
			published: true,
		});

	/**
     * <DropdownMenu>
     <DropdownMenuTrigger asChild>
     <Button variant="outline" className="ml-auto scale-100 select-none active:scale-100">
     Columns <ChevronDown className="ml-2 h-4 w-4" />
     </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent align="end">
     {table
     .getAllColumns()
     .filter((column) => column.getCanHide())
     .map((column) => {
     return (
     <DropdownMenuCheckboxItem
     key={column.id}
     className="capitalize"
     checked={column.getIsVisible()}
     onCheckedChange={(value) =>
     column.toggleVisibility(!!value)
     }
     >
     {column.id}
     </DropdownMenuCheckboxItem>
     )
     })}
     </DropdownMenuContent>
     </DropdownMenu>
     */
	return <div></div>;
}

function RefreshAccessTokenIntervalSetting() {
	const DEFAULT_REFRESH_ACCESS_TOKEN_INTERVAL = 1000 * 60 * 45; // 5 minutes
	const [refreshAccessTokenInterval, setRefreshAccessTokenInterval] =
		useState<number>(DEFAULT_REFRESH_ACCESS_TOKEN_INTERVAL / 60 / 1000);

	/**
	 * hover:border-foreground/50 focus-visible:hover:border-border flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
	 */
	return (
		<div className="flex flex-col gap-2">
			<Input
				className="border-2 border-transparent border-purple-500 text-white ring-offset-0 text-foreground bg-foreground-200 focus-visible:border-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:hover:border-none"
				value={refreshAccessTokenInterval}
				onChange={(e) => {
					setRefreshAccessTokenInterval(Number(e.target.value));
				}}
				min={5}
				max={55}
				type="number"
				placeholder="Refresh Access Token Interval"
				disabled
			/>
		</div>
	);
}

function SettingsSidebar({
	currentSection,
	rootRef,
}: {
	currentSection: string;
	rootRef: React.RefObject<HTMLDivElement>;
}) {
	const navRef = React.useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

	const navDividerSettings = {
		orientation: isMobile ? "vertical" : "horizontal",
		className: isMobile ? "h-6" : "",
	} satisfies DividerProps;

	const SettingsNavTitleSettings = {
		currentSection,
		navbarRef: navRef,
		rootRef: rootRef,
		isMobile: isMobile,
	} satisfies Omit<SettingsNavTitleProps, "title" | "icon">;

	useEffect(() => {
		window.addEventListener("resize", () => {
			setIsMobile(window.innerWidth < 768);
		});

		return () => {
			window.removeEventListener("resize", () => {
				setIsMobile(window.innerWidth < 768);
			});
		};
	}, []);
	return (
		<nav
			className={
				"flex md:flex-col flex-row gap-4 md:gap-2 w-full md:w-1/6 p-2 min-w-[20vw] overflow-x-auto md:overflow-y-auto"
			}
			ref={navRef}
		>
			<SettingsNavTitle
				title={"Preferences"}
				icon={<SettingsIcon />}
				{...SettingsNavTitleSettings}
			/>
			<Divider {...navDividerSettings} />
		</nav>
	);
}

function ThemeChangeButton({ theme }: { theme: string }) {
	const { setTheme, theme: currentTheme } = useTheme();

	const ThemeIconClassName = "w-6 h-6 text-foreground";
	return (
		<Button
			onClick={() => {
				setTheme(theme);
			}}
			className={cn(
				"w-full md:w-auto border-2 border-transparent",
				currentTheme === theme
					? "bg-foreground-100 text-foreground border-2 border-purple-500"
					: "bg-foreground-200 text-foreground-200",
			)}
			variant={"ghost"}
			size={"lg"}
		>
			{theme === "light" && <SunIcon className={ThemeIconClassName} />}
			{theme === "dark" && <MoonIcon className={ThemeIconClassName} />}
			{theme === "system" && <ComputerIcon className={ThemeIconClassName} />}
		</Button>
	);
}

function SettingsCardSection({
	title,
	children,
	setCurrentSection,
	root,
}: {
	title: string;
	children?: React.ReactNode;
	setCurrentSection?: React.Dispatch<SetStateAction<string>>;
	root?: React.RefObject<HTMLDivElement>;
}) {
	const [ref, entry] = useIntersectionObserver({
		threshold: 0,
		root: root?.current,
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			setCurrentSection?.(title);
		}
	}, [entry, setCurrentSection, title]);

	//shadow-md
	return (
		<div
			className={
				"p-4 md:p-8 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-full h-max"
			}
		>
			<h1
				data-title={title}
				ref={ref}
				className={"py-2 text-2xl font-bold text-foreground"}
			>
				{title}
			</h1>
			<div className={"flex flex-col gap-4 w-full h-full"}>{children}</div>
		</div>
	);
}

interface SettingsNavTitleProps {
	currentSection: string;
	title: string;
	navbarRef?: React.RefObject<HTMLDivElement>;
	rootRef?: React.RefObject<HTMLDivElement>;
	isMobile?: boolean;
	icon?: React.ReactNode;
}

function SettingsNavTitle({
	currentSection,
	title,
	navbarRef,
	rootRef,
	isMobile,
	icon,
}: SettingsNavTitleProps) {
	const ref = React.useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		if (ref.current && currentSection === title) {
			navbarRef?.current?.scrollTo({
				left: ref.current.offsetLeft - 50,
				behavior: "smooth",
			});
		}
	}, [currentSection, navbarRef, title]);

	return (
		<h6
			onClick={() => {
				const element = document.querySelector(`[data-title="${title}"]`);
				if (element) {
					// get the element's position relative to the viewport of the ref
					if (rootRef && rootRef.current) {
						const top =
							element.getBoundingClientRect().top -
							rootRef?.current?.getBoundingClientRect().top! -
							50;
						// scroll by the amount of top
						rootRef?.current?.scrollBy({
							top,
							behavior: "smooth",
						});
					}
				}
			}}
			ref={ref}
			className={
				"overflow-hidden inline-flex gap-2 text-foreground data-[active=true]:text-foreground data-[active=true]:font-bold hover:text-foreground cursor-pointer hover:font-bold transition-all duration-200 hover:drop-shadow-[0_0px_5px_rgba(100,100,100,0.5)]"
			}
			data-active={currentSection === title}
		>
			<span className="shrink-0">
				{!isMobile && icon} {title}
			</span>
		</h6>
	);
}
