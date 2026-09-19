import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

type GroupProps = React.ComponentProps<typeof ResizablePrimitive.Group>;

/**
 * v2-style API on top of react-resizable-panels v4: `direction` maps to `orientation` and `autoSaveId`
 * persists the layout in localStorage via useDefaultLayout.
 */
const ResizablePanelGroup = ({
	className,
	direction = "horizontal",
	autoSaveId,
	...props
}: Omit<GroupProps, "orientation"> & {
	direction?: "horizontal" | "vertical";
	autoSaveId?: string;
}) => {
	const saved = ResizablePrimitive.useDefaultLayout({
		id: autoSaveId ?? "resizable-unsaved",
		storage: typeof localStorage === "undefined" ? undefined : localStorage,
	});
	return (
		<ResizablePrimitive.Group
			orientation={direction}
			data-panel-group-direction={direction}
			defaultLayout={autoSaveId ? saved.defaultLayout : undefined}
			onLayoutChanged={autoSaveId ? saved.onLayoutChanged : undefined}
			className={cn(
				"flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
				className,
			)}
			{...props}
		/>
	);
};

type PanelProps = React.ComponentProps<typeof ResizablePrimitive.Panel>;
type PanelSize = number | string | undefined;

/** Numbers were percentages in v2 but are pixels in v4; keep the old meaning. */
const percent = (value: PanelSize) =>
	typeof value === "number" ? `${value}%` : value;

const ResizablePanel = ({
	minSize,
	maxSize,
	defaultSize,
	collapsedSize,
	...props
}: PanelProps) => (
	<ResizablePrimitive.Panel
		minSize={percent(minSize)}
		maxSize={percent(maxSize)}
		defaultSize={percent(defaultSize)}
		collapsedSize={percent(collapsedSize)}
		{...props}
	/>
);

const ResizableHandle = ({
	withHandle,
	className,
	handleClassName,
	children,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
	withHandle?: boolean;
	handleClassName?: string;
	children?: React.ReactNode;
}) => (
	<ResizablePrimitive.Separator
		className={cn(
			"relative flex w-px h-full items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
			className,
		)}
		{...props}
	>
		{withHandle && (
			<div
				className={cn(
					"z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border",
					handleClassName,
				)}
			>
				{children || <DragHandleDots2Icon className="h-2.5 w-2.5" />}
			</div>
		)}
		{/* TODO: old icon: GripVertical */}
		{/* {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <DragHandleDots2Icon className="h-2.5 w-2.5" />
      </div>
    )} */}
	</ResizablePrimitive.Separator>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
