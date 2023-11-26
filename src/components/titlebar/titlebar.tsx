import { cn } from "@/lib/utils";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { MdOutlineClose } from "react-icons/md";

export default function Titlebar() {

    const minimize = () => {
        window.app.minimize();
    }

    const maximize = () => {
        window.app.maximize();
    }

    const close = () => {
        window.app.quit()
    }

    return (
        <div className="flex items-center justify-center gap-1 rounded-full border px-4 py-2 no-drag">
            <TitlebarButton
                className="mr-2 text-yellow-500 hover:bg-yellow-800"
                onClick={minimize}
            >
                <Minimize2Icon className="h-3 w-3" />
            </TitlebarButton>
            <TitlebarButton
                className="mr-2 text-green-500 hover:bg-green-800"
                onClick={maximize}
            >
                <Maximize2Icon className="h-3 w-3" />
            </TitlebarButton>
            <TitlebarButton
                className="text-red-500 hover:bg-red-800"
                onClick={close}
            >
                <MdOutlineClose className="h-5 w-5" />
            </TitlebarButton>
        </div>
    );
}


function TitlebarButton({ children, onClick, className }: {
    children: React.ReactNode,
    onClick: () => void,
    className?: string
}) {
    return (
        <button
            className={cn("w-5 h-5 rounded-full bg-foreground/10 inline-flex items-center justify-center p-0.5 hover:scale-110 transition-all hover:text-white", className)}
            onClick={onClick}
        >
            {children}
        </button>
    )
}