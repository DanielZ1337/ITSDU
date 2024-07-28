import { useAtom } from "jotai/index";
import { browseNavigationAtom } from "@/atoms/browse-navigation.ts";

export const useBrowseNavigation = () => {
	const [showBrowseNavigation, setShowBrowseNavigation] =
		useAtom(browseNavigationAtom);

	const toggleBrowseNavigation = () =>
		setShowBrowseNavigation((showBrowseNavigation) => !showBrowseNavigation);

	return {
		showBrowseNavigation,
		setShowBrowseNavigation,
		toggleBrowseNavigation,
	};
};
