"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function Providers({ children }: ThemeProviderProps) {
    return <NextThemesProvider enableSystem attribute={"class"}>{children}</NextThemesProvider>
}
