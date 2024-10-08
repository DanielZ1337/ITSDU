import { ResourceContextMenu } from "@/components/recursive-file-explorer";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { courseNavLinks } from "@/lib/routes";
import useGETcourseFolderResources from "@/queries/courses/useGETcourseFolderResources";
import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources";
import { useNavigateToResource } from "@/types/api-types/extra/learning-tool-id-types";
import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCardContextMenu({
	courseId,
	children,
}: { courseId: number; children: React.ReactNode }) {
	const filteredCourseNavLinks = courseNavLinks.filter(
		(route) => route.end === false,
	);
	const navigate = useNavigate();

	const handleItemClick = (route?: string) => {
		navigate(`/courses/${courseId}/${route}`);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				{filteredCourseNavLinks.map((route) => {
					switch (route.title) {
						case "Resources":
							return (
								<ContextMenuSub key={route.title}>
									<ContextMenuSubTrigger
										onClick={() => handleItemClick(route.href)}
									>
										{route.title}
									</ContextMenuSubTrigger>
									<Suspense fallback={null}>
										<RootFolderResources courseId={courseId} />
									</Suspense>
								</ContextMenuSub>
							);
						default:
							return (
								<ContextMenuItem
									key={route.title}
									onClick={() => handleItemClick(route.href)}
								>
									{route.title}
								</ContextMenuItem>
							);
					}
				})}
			</ContextMenuContent>
		</ContextMenu>
	);
}

function RootFolderResources({ courseId }: { courseId: number }) {
	const navigate = useNavigate();

	const navigatetoResource = useNavigateToResource(navigate);

	const { data } = useGETcourseRootResources(
		{
			courseId: courseId,
		},
		{
			suspense: true,
		},
	);

	if (data?.Resources.EntityArray.length === 0) {
		return <EmptyFolder />;
	}

	return (
		<ContextMenuSubContent className="max-w-64 w-fit max-h-64 overflow-y-auto overflow-x-hidden text-ellipsis">
			{data?.Resources.EntityArray.map((parent) => {
				if (parent.ElementType === "Folder") {
					return (
						<ContextMenuSub key={parent.ElementId}>
							<ContextMenuSubTrigger onClick={() => navigatetoResource(parent)}>
								{parent.Title}
							</ContextMenuSubTrigger>
							<Suspense fallback={null}>
								<FolderResources
									courseId={courseId}
									folderId={parent.ElementId}
								/>
							</Suspense>
						</ContextMenuSub>
					);
				} else {
					return (
						<ResourceContextMenu resource={parent} key={parent.ElementId}>
							<ContextMenuItem
								key={parent.ElementId}
								onClick={() => navigatetoResource(parent)}
							>
								{parent.Title}
							</ContextMenuItem>
						</ResourceContextMenu>
					);
				}
			})}
		</ContextMenuSubContent>
	);
}

function FolderResources({
	courseId,
	folderId,
}: { courseId: number; folderId: number }) {
	const navigate = useNavigate();

	const navigatetoResource = useNavigateToResource(navigate);

	const { data } = useGETcourseFolderResources(
		{
			courseId,
			folderId,
		},
		{
			suspense: true,
		},
	);

	if (data?.Resources.EntityArray.length === 0) {
		return <EmptyFolder />;
	}

	return (
		<ContextMenuSubContent className="max-w-64 w-fit max-h-64 overflow-y-auto overflow-x-hidden text-ellipsis">
			{data?.Resources.EntityArray.map((parent) => {
				if (parent.ElementType === "Folder") {
					return (
						<ContextMenuSub key={parent.ElementId}>
							<ContextMenuSubTrigger onClick={() => navigatetoResource(parent)}>
								{parent.Title}
							</ContextMenuSubTrigger>
							<Suspense fallback={null}>
								<FolderResources
									courseId={courseId}
									folderId={parent.ElementId}
								/>
							</Suspense>
						</ContextMenuSub>
					);
				} else {
					return (
						<ResourceContextMenu resource={parent} key={parent.ElementId}>
							<ContextMenuItem
								onClick={() => navigatetoResource(parent)}
								key={parent.ElementId}
							>
								{parent.Title}
							</ContextMenuItem>
						</ResourceContextMenu>
					);
				}
			})}
		</ContextMenuSubContent>
	);
}

function EmptyFolder() {
	return (
		<ContextMenuSubContent className="max-w-64 w-fit max-h-64 overflow-y-auto overflow-x-hidden text-ellipsis">
			<ContextMenuSub>
				<ContextMenuSubTrigger
					disabled
					className="dark:text-gray-300 text-gray-700"
					chevron={false}
				>
					No resources found
				</ContextMenuSubTrigger>
			</ContextMenuSub>
		</ContextMenuSubContent>
	);
}
