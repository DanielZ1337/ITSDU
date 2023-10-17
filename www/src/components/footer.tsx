export default function Footer() {
    return (
        <footer
            className="flex flex-col items-center justify-center w-full h-24 border-t dark:border-primary/10 border-primary/5">
            <div className="flex items-center justify-center gap-x-2">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Made with by {" "}
                    <span className="hover:underline cursor-pointer">
                        Daniel Bermann Schmidt.
                    </span>
                </span>
            </div>
            <div className="flex items-center justify-center gap-x-2 mt-2">
                <a href="/" className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Home
                </a>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    •
                </span>
                <a href="/privacy" className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Privacy
                </a>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    •
                </span>
                <a href="/terms" className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Terms
                </a>
            </div>
        </footer>

    )
}