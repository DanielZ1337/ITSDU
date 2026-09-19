import { createStore, Provider as JotaiProvider } from "jotai";
import {
	createContext,
	type RefObject,
	Suspense,
	startTransition,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	createPath,
	type NavigateOptions,
	RouterProvider,
	type To,
} from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { createTabRouter, type TabRouter } from "@/lib/tabs/tab-routes";

const SESSION_KEY = "itsdu:workspace-tabs:v1";
const SESSION_VERSION = 1;
const MAX_RESTORED_TABS = 20;

export type TabLocation = {
	pathname: string;
	search: string;
	hash: string;
	state?: unknown;
};

export type AppTab = {
	id: string;
	title: string;
	location: TabLocation;
	mounted: boolean;
	createdAt: number;
	lastActiveAt: number;
};

type PersistedSession = {
	version: 1;
	activeTabId: string;
	tabs: Array<Omit<AppTab, "mounted">>;
};

type TabRuntime = {
	router: TabRouter;
	store: ReturnType<typeof createStore>;
	unsubscribe: () => void;
};

type OpenTabOptions = {
	activate?: boolean;
	state?: unknown;
	title?: string;
};

type TabsContextValue = {
	tabs: AppTab[];
	activeTabId: string;
	activeTab: AppTab;
	activeCourseId?: number;
	navigate: (to: To | number, options?: NavigateOptions) => Promise<void>;
	openTab: (to?: To, options?: OpenTabOptions) => string;
	duplicateTab: (tabId: string) => void;
	closeTab: (tabId: string) => void;
	closeOtherTabs: (tabId: string) => void;
	closeTabsToRight: (tabId: string) => void;
	switchTab: (tabId: string) => void;
	moveTab: (tabId: string, targetIndex: number) => void;
	reopenClosedTab: () => void;
	goBack: () => Promise<void>;
	goForward: () => Promise<void>;
	reload: () => Promise<void>;
	getRuntime: (tabId: string) => TabRuntime;
	setTabTitle: (tabId: string, title: string) => void;
};

type TabRuntimeContextValue = {
	tabId: string;
	isActive: boolean;
};

const TabsContext = createContext<TabsContextValue | null>(null);
const TabRuntimeContext = createContext<TabRuntimeContextValue | null>(null);

const createId = () => crypto.randomUUID();

function toSerializableState(value: unknown) {
	if (value === undefined) return undefined;
	try {
		return JSON.parse(JSON.stringify(value)) as unknown;
	} catch {
		return undefined;
	}
}

function normalizeLocation(location: {
	pathname: string;
	search?: string;
	hash?: string;
	state?: unknown;
}): TabLocation {
	return {
		pathname: location.pathname || "/",
		search: location.search ?? "",
		hash: location.hash ?? "",
		state: toSerializableState(location.state),
	};
}

function locationUrl(location: TabLocation) {
	return createPath(location);
}

function parseUrl(url: string, state?: unknown): TabLocation {
	const parsed = new URL(url || "/", "https://itsdu.local");
	return {
		pathname: parsed.pathname || "/",
		search: parsed.search,
		hash: parsed.hash,
		state: toSerializableState(state),
	};
}

function titleForLocation(location: TabLocation) {
	const path = location.pathname;
	const course = /^\/courses\/([^/]+)/.exec(path);
	const document = /^\/documents\/(?:pdf|office|media|other)\/([^/]+)/.exec(
		path,
	);
	const message = /^\/messages\/([^/]+)/.exec(path);

	if (course) return `Course ${course[1]}`;
	if (document) return `Document ${document[1]}`;
	if (message) return `Message ${message[1]}`;

	return (
		{
			"/": "Home",
			"/overview": "Overview",
			"/courses": "Courses",
			"/calendar": "Calendar",
			"/all-tasks": "Tasks",
			"/messages": "Messages",
			"/updates": "Updates",
			"/resources": "Resources",
			"/profile": "Profile",
			"/ai-chats": "AI Chats",
			"/merge-zip-documents": "Merge & ZIP",
		}[path] ??
		path.split("/").filter(Boolean).at(-1) ??
		"New tab"
	);
}

function initialUrlFromHash() {
	const hash = window.location.hash.slice(1);
	return hash.startsWith("/") ? hash : "/";
}

function createTab(location: TabLocation, title?: string): AppTab {
	const now = Date.now();
	return {
		id: createId(),
		title: title ?? titleForLocation(location),
		location,
		mounted: true,
		createdAt: now,
		lastActiveAt: now,
	};
}

function loadSession(): { tabs: AppTab[]; activeTabId: string } {
	const hashLocation = parseUrl(initialUrlFromHash());
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		if (!raw) throw new Error("No saved tab session");
		const value = JSON.parse(raw) as Partial<PersistedSession>;
		if (value.version !== SESSION_VERSION || !Array.isArray(value.tabs)) {
			throw new Error("Unsupported tab session");
		}

		const tabs = value.tabs
			.filter(
				(tab) =>
					tab &&
					typeof tab.id === "string" &&
					typeof tab.title === "string" &&
					typeof tab.location?.pathname === "string",
			)
			.slice(0, MAX_RESTORED_TABS)
			.map((tab) => ({
				...tab,
				location: normalizeLocation(tab.location),
				mounted: tab.id === value.activeTabId,
			}));

		if (tabs.length === 0) throw new Error("Empty tab session");
		const activeTabId = tabs.some((tab) => tab.id === value.activeTabId)
			? (value.activeTabId as string)
			: tabs[0].id;
		const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
		const savedActive = tabs[activeIndex];
		if (locationUrl(savedActive.location) !== locationUrl(hashLocation)) {
			tabs[activeIndex] = {
				...savedActive,
				location: hashLocation,
				title: titleForLocation(hashLocation),
			};
		}
		return { tabs, activeTabId };
	} catch {
		const tab = createTab(hashLocation);
		return { tabs: [tab], activeTabId: tab.id };
	}
}

function syncWindowHash(location: TabLocation) {
	const next = `#${locationUrl(location)}`;
	if (window.location.hash !== next) {
		window.history.replaceState(window.history.state, "", next);
	}
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
	const initial = useMemo(loadSession, []);
	const [tabs, setTabs] = useState(initial.tabs);
	const [activeTabId, setActiveTabId] = useState(initial.activeTabId);
	const activeTabIdRef = useRef(initial.activeTabId);
	const runtimes = useRef(new Map<string, TabRuntime>());
	const closedTabs = useRef<Array<Omit<AppTab, "mounted">>>([]);

	const setTabTitle = useCallback((tabId: string, title: string) => {
		const cleaned = title.trim();
		if (!cleaned) return;
		setTabs((current) =>
			current.some((tab) => tab.id === tabId && tab.title !== cleaned)
				? current.map((tab) =>
						tab.id === tabId ? { ...tab, title: cleaned } : tab,
					)
				: current,
		);
		if (activeTabIdRef.current === tabId) document.title = cleaned;
	}, []);

	const getRuntime = useCallback(
		(tabId: string) => {
			const existing = runtimes.current.get(tabId);
			if (existing) return existing;

			const tab = tabs.find((candidate) => candidate.id === tabId);
			if (!tab) throw new Error(`Unknown tab: ${tabId}`);
			const router = createTabRouter(tab.location);
			const runtime: TabRuntime = {
				router,
				store: createStore(),
				unsubscribe: () => {},
			};
			runtime.unsubscribe = router.subscribe((state) => {
				const location = normalizeLocation(state.location);
				setTabs((current) =>
					current.map((item) =>
						item.id === tabId
							? {
									...item,
									location,
									title: titleForLocation(location),
								}
							: item,
					),
				);
				if (activeTabIdRef.current === tabId) syncWindowHash(location);
			});
			runtimes.current.set(tabId, runtime);
			return runtime;
		},
		[tabs],
	);

	const switchTab = useCallback(
		(tabId: string) => {
			const tab = tabs.find((candidate) => candidate.id === tabId);
			if (!tab || tabId === activeTabIdRef.current) return;
			activeTabIdRef.current = tabId;
			startTransition(() => {
				setActiveTabId(tabId);
				setTabs((current) =>
					current.map((item) =>
						item.id === tabId
							? { ...item, mounted: true, lastActiveAt: Date.now() }
							: item,
					),
				);
			});
			syncWindowHash(tab.location);
			document.title = tab.title;
			requestAnimationFrame(() =>
				requestAnimationFrame(() => window.dispatchEvent(new Event("resize"))),
			);
		},
		[tabs],
	);

	const openTab = useCallback((to: To = "/", options: OpenTabOptions = {}) => {
		const path = typeof to === "string" ? to : createPath(to);
		const tab = createTab(parseUrl(path, options.state), options.title);
		setTabs((current) => [...current, tab]);
		if (options.activate !== false) {
			activeTabIdRef.current = tab.id;
			setActiveTabId(tab.id);
			syncWindowHash(tab.location);
			document.title = tab.title;
		}
		return tab.id;
	}, []);

	const disposeTab = useCallback((tabId: string) => {
		const runtime = runtimes.current.get(tabId);
		if (!runtime) return;
		runtime.unsubscribe();
		runtime.router.dispose();
		runtimes.current.delete(tabId);
	}, []);

	const closeTab = useCallback(
		(tabId: string) => {
			const index = tabs.findIndex((tab) => tab.id === tabId);
			if (index < 0) return;
			const closing = tabs[index];
			closedTabs.current.push({
				id: closing.id,
				title: closing.title,
				location: closing.location,
				createdAt: closing.createdAt,
				lastActiveAt: closing.lastActiveAt,
			});
			disposeTab(tabId);

			if (tabs.length === 1) {
				const replacement = createTab(parseUrl("/"));
				activeTabIdRef.current = replacement.id;
				setTabs([replacement]);
				setActiveTabId(replacement.id);
				syncWindowHash(replacement.location);
				return;
			}

			const remaining = tabs.filter((tab) => tab.id !== tabId);
			setTabs(remaining);
			if (activeTabIdRef.current === tabId) {
				const next = remaining[Math.min(index, remaining.length - 1)];
				activeTabIdRef.current = next.id;
				setActiveTabId(next.id);
				syncWindowHash(next.location);
				document.title = next.title;
			}
		},
		[disposeTab, tabs],
	);

	const closeOtherTabs = useCallback(
		(tabId: string) => {
			for (const tab of tabs) {
				if (tab.id !== tabId) disposeTab(tab.id);
			}
			const kept = tabs.find((tab) => tab.id === tabId);
			if (!kept) return;
			activeTabIdRef.current = tabId;
			setTabs([{ ...kept, mounted: true, lastActiveAt: Date.now() }]);
			setActiveTabId(tabId);
			syncWindowHash(kept.location);
		},
		[disposeTab, tabs],
	);

	const closeTabsToRight = useCallback(
		(tabId: string) => {
			const index = tabs.findIndex((tab) => tab.id === tabId);
			if (index < 0) return;
			for (const tab of tabs.slice(index + 1)) disposeTab(tab.id);
			const remaining = tabs.slice(0, index + 1);
			setTabs(remaining);
			if (!remaining.some((tab) => tab.id === activeTabIdRef.current)) {
				switchTab(tabId);
			}
		},
		[disposeTab, switchTab, tabs],
	);

	const duplicateTab = useCallback(
		(tabId: string) => {
			const tab = tabs.find((candidate) => candidate.id === tabId);
			if (!tab) return;
			openTab(locationUrl(tab.location), {
				state: tab.location.state,
				title: tab.title,
			});
		},
		[openTab, tabs],
	);

	const moveTab = useCallback((tabId: string, targetIndex: number) => {
		setTabs((current) => {
			const sourceIndex = current.findIndex((tab) => tab.id === tabId);
			if (sourceIndex < 0) return current;
			const next = [...current];
			const [tab] = next.splice(sourceIndex, 1);
			next.splice(Math.max(0, Math.min(targetIndex, next.length)), 0, tab);
			return next;
		});
	}, []);

	const reopenClosedTab = useCallback(() => {
		const closed = closedTabs.current.pop();
		if (!closed) return;
		openTab(locationUrl(closed.location), {
			state: closed.location.state,
			title: closed.title,
		});
	}, [openTab]);

	const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
	const activeRuntime = getRuntime(activeTab.id);

	const navigate = useCallback(
		async (to: To | number, options?: NavigateOptions) => {
			if (typeof to === "number") await activeRuntime.router.navigate(to);
			else await activeRuntime.router.navigate(to, options);
		},
		[activeRuntime],
	);

	const goBack = useCallback(
		() => activeRuntime.router.navigate(-1),
		[activeRuntime],
	);
	const goForward = useCallback(
		() => activeRuntime.router.navigate(1),
		[activeRuntime],
	);
	const reload = useCallback(
		() => activeRuntime.router.navigate(0),
		[activeRuntime],
	);

	useEffect(() => {
		activeTabIdRef.current = activeTabId;
		syncWindowHash(activeTab.location);
		document.title = activeTab.title;
	}, [activeTab, activeTabId]);

	useEffect(() => {
		const persisted: PersistedSession = {
			version: SESSION_VERSION,
			activeTabId,
			tabs: tabs.map(({ mounted: _mounted, ...tab }) => ({
				...tab,
				location: {
					...tab.location,
					state: toSerializableState(tab.location.state),
				},
			})),
		};
		localStorage.setItem(SESSION_KEY, JSON.stringify(persisted));
	}, [activeTabId, tabs]);

	useEffect(
		() => () => {
			for (const runtime of runtimes.current.values()) {
				runtime.unsubscribe();
				runtime.router.dispose();
			}
		},
		[],
	);

	const activeCourseMatch = /^\/courses\/(\d+)/.exec(
		activeTab.location.pathname,
	);
	const activeCourseId = activeCourseMatch
		? Number(activeCourseMatch[1])
		: undefined;

	const value = useMemo<TabsContextValue>(
		() => ({
			tabs,
			activeTabId,
			activeTab,
			activeCourseId,
			navigate,
			openTab,
			duplicateTab,
			closeTab,
			closeOtherTabs,
			closeTabsToRight,
			switchTab,
			moveTab,
			reopenClosedTab,
			goBack,
			goForward,
			reload,
			getRuntime,
			setTabTitle,
		}),
		[
			activeCourseId,
			activeTab,
			activeTabId,
			closeOtherTabs,
			closeTab,
			closeTabsToRight,
			duplicateTab,
			getRuntime,
			goBack,
			goForward,
			moveTab,
			navigate,
			openTab,
			reload,
			reopenClosedTab,
			setTabTitle,
			switchTab,
			tabs,
		],
	);

	return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export function useTabs() {
	const context = useContext(TabsContext);
	if (!context) throw new Error("useTabs must be used inside TabsProvider");
	return context;
}

export function useTabRuntime() {
	return useContext(TabRuntimeContext);
}

export function TabTitle({ children }: { children?: string }) {
	const runtime = useTabRuntime();
	const { setTabTitle } = useTabs();
	const tabId = runtime?.tabId;

	useEffect(() => {
		if (tabId && children) setTabTitle(tabId, children);
	}, [children, setTabTitle, tabId]);

	return null;
}

export function TabContentHost({
	viewportRef,
}: {
	viewportRef?: RefObject<HTMLDivElement | null>;
}) {
	const { tabs, activeTabId, getRuntime, openTab } = useTabs();
	const openModifiedLink = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!(event.ctrlKey || event.metaKey || event.button === 1)) return;
			const anchor = (event.target as HTMLElement).closest("a[href]");
			if (!anchor || anchor.hasAttribute("download")) return;
			const href = anchor.getAttribute("href");
			if (!href) return;
			const path = href.startsWith("#/") ? href.slice(1) : href;
			if (!path.startsWith("/")) return;
			event.preventDefault();
			event.stopPropagation();
			openTab(path, { activate: event.button !== 1 });
		},
		[openTab],
	);

	return (
		<div className="relative flex min-h-0 flex-1 overflow-hidden">
			{tabs.map((tab) => {
				if (!tab.mounted) return null;
				const runtime = getRuntime(tab.id);
				const isActive = tab.id === activeTabId;
				return (
					<div
						key={tab.id}
						ref={isActive ? viewportRef : undefined}
						aria-hidden={!isActive}
						onClickCapture={openModifiedLink}
						onAuxClickCapture={openModifiedLink}
						className="absolute inset-0 min-h-0 overflow-x-auto overflow-y-auto"
						style={{ display: isActive ? "flex" : "none" }}
					>
						<JotaiProvider store={runtime.store}>
							<TabRuntimeContext.Provider value={{ tabId: tab.id, isActive }}>
								<Suspense
									fallback={
										<div className="flex flex-1 items-center justify-center">
											<Spinner size="lg" label="Loading..." />
										</div>
									}
								>
									<RouterProvider router={runtime.router} />
								</Suspense>
							</TabRuntimeContext.Provider>
						</JotaiProvider>
					</div>
				);
			})}
		</div>
	);
}
