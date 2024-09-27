import React from 'react'
import {Button} from '../ui/button'

export default function TitlebarDropdownFallback({children}: { children: React.ReactNode }) {
    return (
        <div className={"animate-pulse"}>
            <Button variant={"ghost"} size={"icon"} className={"shrink-0"}>
                {children}
            </Button>
        </div>
    )
}
