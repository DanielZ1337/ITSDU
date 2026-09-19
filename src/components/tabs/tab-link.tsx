import { type AnchorHTMLAttributes, forwardRef, type MouseEvent } from "react";
import { createPath, type To } from "react-router-dom";
import { useTabs } from "./tab-manager";

type TabLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
	to: To;
	state?: unknown;
};

export const TabLink = forwardRef<HTMLAnchorElement, TabLinkProps>(
	({ to, state, onClick, onAuxClick, ...props }, ref) => {
		const { navigate, openTab } = useTabs();
		const href = `#${typeof to === "string" ? to : createPath(to)}`;
		const open = (event: MouseEvent<HTMLAnchorElement>) => {
			if (event.defaultPrevented) return;
			if (event.button === 1 || event.ctrlKey || event.metaKey) {
				event.preventDefault();
				openTab(to, { state, activate: event.button !== 1 });
				return;
			}
			if (event.button === 0 && !event.altKey && !event.shiftKey) {
				event.preventDefault();
				void navigate(to, { state });
			}
		};

		return (
			<a
				{...props}
				ref={ref}
				href={href}
				onClick={(event) => {
					onClick?.(event);
					open(event);
				}}
				onAuxClick={(event) => {
					onAuxClick?.(event);
					open(event);
				}}
			/>
		);
	},
);
TabLink.displayName = "TabLink";
