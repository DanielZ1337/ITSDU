import { useShowSettingsModal } from '@/hooks/atoms/useSettingsModal'
import { useTheme } from 'next-themes'
import { useCallback, useEffect } from 'react'

export function GlobalShortcuts() {
	const { theme, setTheme } = useTheme()

	const handleDarkModeToggle = useCallback(async () => {
		const isDarkMode = await window.darkMode.toggle()
		setTheme(isDarkMode ? 'dark' : 'light')
	}, [setTheme])

	const { toggleSettingsModal } = useShowSettingsModal()
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.ctrlKey && e.key === 't') {
				e.preventDefault()
				handleDarkModeToggle()
			}

			if (e.ctrlKey && e.key === 'q') {
				e.preventDefault()
				window.app.exit().then((r) => {
					console.log(r)
				})
			}
			if (e.ctrlKey && e.key === 's') {
				e.preventDefault()
				toggleSettingsModal()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleDarkModeToggle])

	return <></>
}
