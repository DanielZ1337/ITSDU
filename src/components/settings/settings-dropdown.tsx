import SettingsDropdownUserFullname from "@/components/settings/settings-dropdown-user-fullname.tsx";
import { buttonVariants } from "@/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useAboutModal } from "@/hooks/atoms/useAboutModal.ts";
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal.ts";
import { useVersion } from "@/hooks/atoms/useVersion.ts";
import { cn, isMacOS } from "@/lib/utils.ts";
import { useAtom } from "jotai";
import { MoreVertical } from "lucide-react";
import { useTheme } from "next-themes";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { browseNavigationAtom as showBrowseNavAtom } from "../../atoms/browse-navigation.ts";

export default function SettingsDropdown({
	triggerComponent,
	onOpenChange,
}: {
	triggerComponent: React.ReactNode;
	onOpenChange?: (isOpen: boolean) => void;
}) {
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();

	const handleDarkModeToggle = useCallback(async () => {
		const isDarkMode = await window.darkMode.toggle();
		setTheme(isDarkMode ? "dark" : "light");
	}, [setTheme]);

	const { toggleSettingsModal } = useShowSettingsModal();
	const { version } = useVersion();
	const [showBrowseNav, setShowBrowseNav] = useAtom(showBrowseNavAtom);
	const { toggleAboutModal } = useAboutModal();
	const commandOrControl = () => {
		if (isMacOS()) {
			return "⌘";
		} else {
			return "Ctrl ";
		}
	};

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		onOpenChange?.(isOpen);
	}, [isOpen, onOpenChange]);

	function dropdownItemOnClick(
		e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
		callback: () => void,
	) {
		e.stopPropagation();
		e.preventDefault();
		callback();
	}

	return (
		<DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger
				className={cn(
					buttonVariants({
						variant: "ghost",
						size: "icon",
					}),
				)}
				asChild
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			>
				{triggerComponent}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel className={"flex justify-between items-center"}>
					<span className={"text-sm"}>Settings</span>
					<span className={"text-xs text-gray-500"}>{version}</span>
				</DropdownMenuLabel>
				{/*user name*/}
				<DropdownMenuLabel className={"font-normal"}>
					<ErrorBoundary
						fallback={<div className={"animate-pulse"}>Loading...</div>}
					>
						<Suspense
							fallback={<div className={"animate-pulse"}>Loading...</div>}
						>
							<SettingsDropdownUserFullname />
						</Suspense>
					</ErrorBoundary>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={(e) =>
						dropdownItemOnClick(e, () => {
							handleDarkModeToggle();
						})
					}
				>
					<span className={"text-sm"}>
						{theme === "dark" ? "Light" : "Dark"}
					</span>
					<DropdownMenuShortcut>{commandOrControl()}T</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) =>
						dropdownItemOnClick(e, () => {
							toggleSettingsModal();
						})
					}
				>
					Settings
					<DropdownMenuShortcut>{commandOrControl()}S</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) =>
						dropdownItemOnClick(e, () => {
							setShowBrowseNav(!showBrowseNav);
						})
					}
				>
					Browser Navbar
				</DropdownMenuItem>
				<DropdownMenuItem>
					<span>Keyboard shortcuts</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) =>
						dropdownItemOnClick(e, () => {
							toggleAboutModal();
						})
					}
				>
					<span>About</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						window.auth.logout().then(() => {
							console.log("logged out");
						});
					}}
					className={
						"hover:!bg-destructive focus:!bg-destructive hover:!text-white"
					}
				>
					<span>Sign out</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						window.app.exit().then((r) => {
							console.log(r);
						});
					}}
					className={
						"hover:!bg-destructive focus:!bg-destructive hover:!text-white"
					}
				>
					<span>Exit</span>
					<DropdownMenuShortcut>{commandOrControl()}Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
