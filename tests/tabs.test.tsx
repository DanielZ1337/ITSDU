// @vitest-environment happy-dom

import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TabsProvider, useTabs } from "@/components/tabs/tab-manager";

let tabsApi: ReturnType<typeof useTabs> | undefined;

function Harness() {
	tabsApi = useTabs();
	return null;
}

function api() {
	if (!tabsApi) throw new Error("Tabs API was not mounted");
	return tabsApi;
}

describe("workspace tabs", () => {
	beforeEach(() => {
		localStorage.clear();
		window.history.replaceState(null, "", "#/overview");
		tabsApi = undefined;
	});

	afterEach(() => {
		cleanup();
	});

	it("opens and switches between independent locations", async () => {
		render(
			<TabsProvider>
				<Harness />
			</TabsProvider>,
		);
		const firstId = api().activeTabId;

		let courseId = "";
		act(() => {
			courseId = api().openTab("/courses/42");
		});
		expect(api().activeTab.location.pathname).toBe("/courses/42");

		await act(async () => {
			await api().navigate("/courses/42/resources");
		});
		expect(api().activeTab.location.pathname).toBe("/courses/42/resources");

		act(() => api().switchTab(firstId));
		expect(api().activeTab.location.pathname).toBe("/overview");

		act(() => api().switchTab(courseId));
		expect(api().activeTab.location.pathname).toBe("/courses/42/resources");
	});

	it("keeps a workspace open when its final tab is closed", () => {
		render(
			<TabsProvider>
				<Harness />
			</TabsProvider>,
		);

		act(() => api().closeTab(api().activeTabId));

		expect(api().tabs).toHaveLength(1);
		expect(api().activeTab.location.pathname).toBe("/");
	});

	it("restores the last closed tab", () => {
		render(
			<TabsProvider>
				<Harness />
			</TabsProvider>,
		);

		let tabId = "";
		act(() => {
			tabId = api().openTab("/calendar");
		});
		act(() => api().closeTab(tabId));
		act(() => api().reopenClosedTab());

		expect(api().activeTab.location.pathname).toBe("/calendar");
	});
});
