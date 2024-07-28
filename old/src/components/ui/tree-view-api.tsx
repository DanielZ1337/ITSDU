'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'

type TreeViewElement = {
	id: string
	name: string
	isSelectable?: boolean
	children?: TreeViewElement[]
}

type TreeContextProps = {
	selectedId: string | undefined
	expendedItems: string[] | undefined
	indicator: boolean
	handleExpand: (id: string) => void
	selectItem: (id: string) => void
	setExpendedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>
	openIcon?: React.ReactNode
	closeIcon?: React.ReactNode
	direction: 'rtl' | 'ltr'
}

const TreeContext = createContext<TreeContextProps | null>(null)

const useTree = () => {
	const context = useContext(TreeContext)
	if (!context) {
		throw new Error('useTree must be used within a TreeProvider')
	}
	return context
}

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type Direction = 'rtl' | 'ltr' | undefined

type TreeViewProps = {
	initialSelectedId?: string
	indicator?: boolean
	elements?: TreeViewElement[]
	initialExpendedItems?: string[]
	openIcon?: React.ReactNode
	closeIcon?: React.ReactNode
} & TreeViewComponentProps

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
	(
		{
			className,
			elements,
			initialSelectedId,
			initialExpendedItems,
			children,
			indicator = true,
			openIcon,
			closeIcon,
			dir,
			...props
		},
		ref
	) => {
		const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId)
		const [expendedItems, setExpendedItems] = useState<string[] | undefined>(initialExpendedItems)

		const selectItem = useCallback((id: string) => {
			setSelectedId(id)
		}, [])

		const handleExpand = useCallback((id: string) => {
			setExpendedItems((prev) => {
				if (prev?.includes(id)) {
					return prev.filter((item) => item !== id)
				}
				return [...(prev ?? []), id]
			})
		}, [])

		const expandSpecificTargetedElements = useCallback((elements?: TreeViewElement[], selectId?: string) => {
			if (!elements || !selectId) return
			const findParent = (currentElement: TreeViewElement, currentPath: string[] = []) => {
				const isSelectable = currentElement.isSelectable ?? true
				const newPath = [...currentPath, currentElement.id]
				if (currentElement.id === selectId) {
					if (isSelectable) {
						setExpendedItems((prev) => [...(prev ?? []), ...newPath])
					} else {
						if (newPath.includes(currentElement.id)) {
							newPath.pop()
							setExpendedItems((prev) => [...(prev ?? []), ...newPath])
						}
					}
					return
				}
				if (isSelectable && currentElement.children && currentElement.children.length > 0) {
					currentElement.children.forEach((child) => {
						findParent(child, newPath)
					})
				}
			}
			elements.forEach((element) => {
				findParent(element)
			})
		}, [])

		useEffect(() => {
			if (initialSelectedId) {
				expandSpecificTargetedElements(elements, initialSelectedId)
			}
		}, [initialSelectedId, elements])

		const direction = dir === 'rtl' ? 'rtl' : 'ltr'

		return (
			<TreeContext.Provider
				value={{
					selectedId,
					expendedItems,
					handleExpand,
					selectItem,
					setExpendedItems,
					indicator,
					openIcon,
					closeIcon,
					direction,
				}}
			>
				<div className={cn('size-full', className)}>
					<ScrollArea
						ref={ref}
						className='h-full relative px-2'
						dir={dir as Direction}
					>
						<AccordionPrimitive.Root
							{...props}
							type='multiple'
							defaultValue={expendedItems}
							value={expendedItems}
							className='flex flex-col gap-1'
							onValueChange={(value) => setExpendedItems((prev) => [...(prev ?? []), value[0]])}
							dir={dir as Direction}
						>
							{children}
						</AccordionPrimitive.Root>
					</ScrollArea>
				</div>
			</TreeContext.Provider>
		)
	}
)

Tree.displayName = 'Tree'

const TreeIndicator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const { direction } = useTree()

		return (
			<div
				dir={direction}
				ref={ref}
				className={cn(
					'h-full w-px bg-muted absolute left-1.5 rtl:right-1.5 py-3 rounded-md hover:bg-slate-300 duration-300 ease-in-out',
					className
				)}
				{...props}
			/>
		)
	}
)

TreeIndicator.displayName = 'TreeIndicator'

interface ChildComponentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

type ChildProps = {
	expendedItems?: string[]
	element: string
	isSelectable?: boolean
	isSelect?: boolean
} & ChildComponentProps

const Child = forwardRef<HTMLDivElement, ChildProps & React.HTMLAttributes<HTMLDivElement>>(
	({ className, element, value, isSelectable = true, isSelect, children, ...props }, ref) => {
		const { direction, handleExpand, expendedItems, indicator, setExpendedItems, openIcon, closeIcon } = useTree()

		return (
			<AccordionPrimitive.Item
				{...props}
				value={value}
				className='relative overflow-hidden h-full '
			>
				<AccordionPrimitive.Trigger
					className={cn(`flex items-center gap-1 text-sm rounded-md`, className, {
						'bg-muted rounded-md': isSelect && isSelectable,
						'cursor-pointer': isSelectable,
						'cursor-not-allowed opacity-50': !isSelectable,
					})}
					disabled={!isSelectable}
					onClick={() => handleExpand(value)}
				>
					{expendedItems?.includes(value)
						? openIcon ?? <FolderOpenIcon className='shrink-0 h-4 w-4' />
						: closeIcon ?? <FolderIcon className='shrink-0 h-4 w-4' />}
					<span>{element}</span>
				</AccordionPrimitive.Trigger>
				<AccordionPrimitive.Content className='text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full'>
					{element && indicator && <TreeIndicator aria-hidden='true' />}
					<AccordionPrimitive.Root
						dir={direction}
						type='multiple'
						className='flex flex-col gap-1 py-1 ml-5 rtl:mr-5 '
						defaultValue={expendedItems}
						value={expendedItems}
						onValueChange={(value) => {
							setExpendedItems?.((prev) => [...(prev ?? []), value[0]])
						}}
					>
						{children}
					</AccordionPrimitive.Root>
				</AccordionPrimitive.Content>
			</AccordionPrimitive.Item>
		)
	}
)

Child.displayName = 'Child'

const Entry = forwardRef<
	HTMLButtonElement,
	{
		value: string
		handleSelect?: (id: string) => void
		isSelectable?: boolean
		isSelect?: boolean
		entryIcon?: React.ReactNode
	} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ value, className, handleSelect, isSelectable = true, isSelect, entryIcon, children, ...props }, ref) => {
	const { direction, selectedId, selectItem } = useTree()
	const isSelected = isSelect ?? selectedId === value
	return (
		<AccordionPrimitive.Item
			value={value}
			className='relative'
		>
			<AccordionPrimitive.Trigger
				ref={ref}
				{...props}
				dir={direction}
				disabled={!isSelectable}
				aria-label='File'
				className={cn(
					'flex items-center gap-1 cursor-pointer text-sm pr-1 rtl:pl-1 rtl:pr-0 rounded-md  duration-200 ease-in-out',
					{
						'bg-muted': isSelected && isSelectable,
					},
					isSelectable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
					className
				)}
				onClick={() => selectItem(value)}
			>
				{entryIcon ?? <FileIcon className='shrink-0 h-4 w-4' />}
				{children}
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Item>
	)
})

Entry.displayName = 'Entry'

const CollapseButton = forwardRef<
	HTMLButtonElement,
	{
		elements: TreeViewElement[]
		expandAll?: boolean
		expandAllIcon?: React.ReactNode
		collapseAllIcon?: React.ReactNode
	} & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, expandAllIcon, collapseAllIcon, children, ...props }, ref) => {
	const { expendedItems, setExpendedItems } = useTree()

	const expendAllTree = useCallback((elements: TreeViewElement[]) => {
		const expandTree = (element: TreeViewElement) => {
			const isSelectable = element.isSelectable ?? true
			if (isSelectable && element.children && element.children.length > 0) {
				setExpendedItems?.((prev) => [...(prev ?? []), element.id])
				element.children.forEach(expandTree)
			}
		}

		elements.forEach(expandTree)
	}, [])

	const closeAll = useCallback(() => {
		setExpendedItems?.([])
	}, [])

	useEffect(() => {
		if (expandAll) {
			expendAllTree(elements)
		}
	}, [expandAll])

	const isTreeCollapsed = expendedItems && expendedItems.length === 0

	return (
		<Button
			size={'icon'}
			variant={'ghost'}
			className={cn('h-8 w-fit p-1 absolute bottom-1 right-2', className)}
			onClick={expendedItems && expendedItems.length > 0 ? closeAll : () => expendAllTree(elements)}
			ref={ref}
			{...props}
		>
			{isTreeCollapsed ? expandAllIcon : collapseAllIcon} {children}
			<span className='sr-only'>Toggle</span>
		</Button>
	)
})

CollapseButton.displayName = 'CollapseButton'

export { Tree, Child, Entry, CollapseButton, type TreeViewElement }