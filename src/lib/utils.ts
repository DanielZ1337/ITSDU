import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getQueryKeysFromParamsObject = (params: {
    [key: string]: string | number | Date | undefined | boolean | number[]
}) => {
    // eslint-disable-next-line no-unused-vars
    params = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))

    if (Object.keys(params).length === 0) return []

    // turn all date objects into queryKeys with the date in ISO format with only Days, Months and Years

    return Object.keys(params).map((key) => {
        if (params[key] instanceof Date) {
            return (params[key] as Date).toISOString().split("T")[0]
        } else if (typeof params[key] === "boolean") {
            return params[key] ? "true" : "false"
        } else if (Array.isArray(params[key])) {
            return (params[key]! as []).join(",")
        } else {
            return params[key]!.toString()
        }
    })
}

export const baseUrl = import.meta.env.DEV ? 'http://localhost:8080/' : 'https://sdu.itslearning.com/'

export const apiUrl = (route: string, options?: {
    [key: string]: string | number | Date | undefined | boolean | number[]
}) => {
    console.log(route, options)

    // replace all path parameters with the values from the options object
    route.match(/{(.*?)}/g)?.forEach((match) => {
        const key = match.replace("{", "").replace("}", "")
        if (options?.[key] !== undefined) {
            route = route.replace(match, options[key]!.toString())
            delete options[key]
        }
    })

    // remove everything after the first ? in the route
    route = route.split("?")[0]

    const url = new URL(route, baseUrl)

    // add all remaining options as query parameters
    for (const [key, value] of Object.entries(options ?? {})) {
        if (value !== undefined) {
            if (value instanceof Date) {
                url.searchParams.append(key, value.toISOString())
            } else if (typeof value === "boolean") {
                url.searchParams.append(key, value ? "true" : "false")
            } else if (Array.isArray(value)) {
                url.searchParams.append(key, value.join(","))
            } else {
                url.searchParams.append(key, value.toString())
            }
        }
    }

    console.log(url.toString())

    return url.toString()
}