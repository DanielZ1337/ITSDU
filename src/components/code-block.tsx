import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { cn } from "@/lib/utils"
import CopyButton from "@/components/copy-button"
import { customCodeTheme } from "@/styles/custom-code-theme";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from 'framer-motion';


function CodeBlock({
    language,
    value,
    preClass,
    codeClass,
    copyable = true,
    codeWrap = false,
    copyOnHover = false,
}: {
    language: string
    value: string
    preClass?: string
    codeClass?: string
    copyable?: boolean
    codeWrap?: boolean
    copyOnHover?: boolean
}) {
    const { resolvedTheme } = useTheme()
    value = value || ""
    const [isBlockHovered, setIsBlockHovered] = useState(false)

    return (
        <pre
            className={cn(
                "bg-black relative flex w-full h-full overflow-hidden rounded-lg",
                value && "border",
                codeWrap && "whitespace-pre-wrap",
                preClass
            )}

            onMouseEnter={() => {
                setIsBlockHovered(true)
            }}
            onMouseLeave={() => {
                setIsBlockHovered(false)
            }}
        >
            <AnimatePresence>
                {isBlockHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <CopyButton
                            value={value}
                            copyable={copyable}
                            isBlockHovered={copyOnHover ? isBlockHovered : true}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className="absolute -right-4 top-0 h-full w-12 blur bg-gradient-to-l from-black/50 to-transparent"></div>
            <SyntaxHighlighter
                language={language}
                className={cn(
                    `min-w-full px-4 py-3 text-sm`,
                    codeClass
                )}
                style={resolvedTheme === "dark" ? customCodeTheme.dark : customCodeTheme.light}
            >
                {value}
            </SyntaxHighlighter>
        </pre>
    )
}

export default CodeBlock