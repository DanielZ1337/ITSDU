import {cn} from "@/lib/utils";
import {Maximize2Icon, Minimize2Icon} from "lucide-react";
import {MdOutlineClose} from "react-icons/md";

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
        <div className="no-drag flex items-center justify-center gap-1 px-4 py-2 rounded-full border">
            <TitlebarButton
                className="hover:bg-yellow-800 text-yellow-500 mr-2"
                onClick={minimize}
            >
                <Minimize2Icon className="w-3 h-3"/>
            </TitlebarButton>
            <TitlebarButton
                className="hover:bg-green-800 text-green-500 mr-2"
                onClick={maximize}
            >
                <Maximize2Icon className="w-3 h-3"/>
            </TitlebarButton>
            <TitlebarButton
                className="hover:bg-red-800 text-red-500"
                onClick={close}
            >
                <MdOutlineClose className="w-5 h-5"/>
            </TitlebarButton>
        </div>
    );
}


function TitlebarButton({children, onClick, className}: {
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