import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const baseUrl = import.meta.env.DEV ? 'http://localhost:8080/' : 'https://sdu.itslearning.com/'

export const apiUrl = (route: string, options?: { [key: string]: string | number | Date | undefined | boolean | number[] }) => {
    const url = new URL(route, baseUrl)
    for (const [key, value] of Object.entries(options ?? {})) {
        if (value !== undefined) {
            // check if its a query parameter or a path parameter
            if (url.pathname.includes(`{${key}}`)) {
                url.pathname = url.pathname.replace(`{${key}}`, value.toString())
            } else {
                if (value instanceof Date) {
                    url.searchParams.set(key, value.toISOString())
                } else if (typeof value === "boolean") {
                    url.searchParams.set(key, value ? "true" : "false")
                } else if (Array.isArray(value)) {
                    url.searchParams.set(key, value.join(","))
                } else {
                    url.searchParams.set(key, value.toString())
                }
            }
        }
    }

    return url.toString()
}