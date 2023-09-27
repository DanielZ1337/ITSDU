import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button.tsx";

export default function Header() {
    const {theme, setTheme} = useTheme()

    async function handleDarkModeToggle() {
        const isDarkMode = await window.darkMode.toggle()
        setTheme(isDarkMode ? 'dark' : 'light')
    }

    return (
        <Button size={"icon"} onClick={handleDarkModeToggle}>{theme === 'dark' ? 'Light' : 'Dark'}</Button>
    )
}
