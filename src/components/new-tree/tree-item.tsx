import { Child, Entry, TreeViewElement } from "@/components/ui/tree-view-api";

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
								aria-label={`child ${element.name}`}
								elements={element.children}
							/>
						</Child>
					) : (
						<Entry
							key={element.id}
							value={element.id}
							element={element.name}
							isSelectable={element.isSelectable}
							className={"px-1"}
						>
							<span className="ml-1">{element?.name}</span>
						</Entry>
					)}
				</li>
			))}
		</ul>
	);
};
