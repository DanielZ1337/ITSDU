import { cn } from "@/lib/utils";
import { customCodeTheme } from "@/styles/custom-code-theme";
import { AnimatePresence, m } from "framer-motion";
import { useTheme } from "next-themes";
import { lazy, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from "sonner";

const LazyCopyButton = lazy(() => import("@/components/copy-button"));

function CodeBlock({
	language,
	value,
	preClass,
	codeClass,
	copyable = true,
	codeWrap = false,
	copyOnHover = false,
}: {
	language: string;
	value: string;
	preClass?: string;
	codeClass?: string;
	copyable?: boolean;
	codeWrap?: boolean;
	copyOnHover?: boolean;
}) {
	const { resolvedTheme } = useTheme();
	value = value || "";
	const [isBlockHovered, setIsBlockHovered] = useState(false);

	return (
		<pre
			className={cn(
				"relative flex w-full h-full overflow-hidden rounded-lg",
				value && "border",
				codeWrap && "whitespace-pre-wrap",
				preClass,
				//hsl(230, 1%, 98%)
				resolvedTheme === "dark" ? "bg-black" : "bg-[#f6f8fa]",
			)}
			onMouseEnter={() => {
				setIsBlockHovered(true);
			}}
			onMouseLeave={() => {
				setIsBlockHovered(false);
			}}
		>
			<AnimatePresence>
				{isBlockHovered && (
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<LazyCopyButton
							onCopy={() => toast.success("Copied!")}
							value={value}
							copyable={copyable}
							isBlockHovered={copyOnHover ? isBlockHovered : true}
						/>
					</m.div>
				)}
			</AnimatePresence>

			<div className="absolute top-0 -right-4 h-full w-12 bg-gradient-to-l from-black/50 to-transparent blur -z-10"></div>
			<SyntaxHighlighter
				language={language}
				className={cn(
					`min-w-full px-4 py-3 text-sm pointer-events-auto select-text`,
					codeClass,
				)}
				style={
					resolvedTheme === "dark"
						? customCodeTheme.dark
						: customCodeTheme.light
				}
			>
				{value}
			</SyntaxHighlighter>
		</pre>
	);
}

export default CodeBlock;
