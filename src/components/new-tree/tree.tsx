import {
	Child,
	CollapseButton,
	Entry,
	Tree,
	TreeViewElement,
} from "@/components/ui/tree-view-api";
import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources";
import { Minus, MoreHorizontal, Plus } from "lucide-react";

export function ResourcesTreeRoot({ courseId }: { courseId: number }) {
	const { data } = useGETcourseRootResources(
		{
			courseId: courseId,
		},
		{
			suspense: true,
		},
	);

	const elementsMapped = data?.Resources.EntityArray.map((element) => ({
		id: String(element.ElementId),
		name: element.Title,
		isSelectable: true,
	}));

	if (!elementsMapped)
		return (
			<div className="flex flex-col items-center justify-center h-full">
				No resources found
			</div>
		);

	return (
		<Tree className="w-full h-60 p-2 rounded-md" indicator={true}>
			{data?.Resources.EntityArray.map((element, _) => (
				<TreeItem key={element.ElementId} elements={elementsMapped} />
			))}
		</Tree>
	);
}

type TreeItemProps = {
	elements: TreeViewElement[];
};

export const TreeItem = ({ elements }: TreeItemProps) => {
	return (
		<ul className="w-full space-y-1">
			{elements.map((element) => (
				<li key={element.id} className="w-full space-y-2">
					{element.children && element.children?.length > 0 ? (
						<Child
							element={element.name}
							value={element.id}
							isSelectable={element.isSelectable}
							className="px-px pr-1"
						>
							<TreeItem
								key={element.id}
								aria-label={`folder ${element.name}`}
								elements={element.children}
							/>
						</Child>
					) : (
						<Entry
							key={element.id}
							value={element.id}
							isSelectable={element.isSelectable}
						>
							<span>{element?.name}</span>
						</Entry>
					)}
				</li>
			))}
		</ul>
	);
};
