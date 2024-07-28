import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface HighlightProps {
	text: string
	highlight: string
	minChars?: number
}

export function Highlight({ text, highlight, minChars = 3 }: HighlightProps) {
	const memoizedHighlight = React.useMemo(() => highlight, [highlight])
	const memoizedText = React.useMemo(() => text, [text])
	const memoizedParts = React.useMemo(() => {
		if (!memoizedHighlight) {
			return []
		}

		const regex = new RegExp(`(${memoizedHighlight})`, 'gi')
		const partsArray = memoizedText.split(regex)

		return partsArray
	}, [memoizedText, memoizedHighlight])

	if (!memoizedParts || memoizedParts.length === 0 || highlight.length < minChars) {
		return <>{memoizedText}</>
	}

	return memoizedParts.map((part, index) =>
		part.toLowerCase() === highlight.toLowerCase() ? (
			<mark
				key={index + part}
				className='bg-secondary-300 text-secondary-900 rounded-full px-1.5 py-0.5 text-sm'
			>
				{part}
			</mark>
		) : (
			part
		)
	)
}
