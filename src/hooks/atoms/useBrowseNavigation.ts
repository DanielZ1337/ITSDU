import { browseNavigationAtom } from "@/atoms/browse-navigation.ts";
import { useAtom } from "jotai/index";

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
