import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const baseUrl = import.meta.env.DEV ? 'http://localhost:8080/' : 'https://sdu.itslearning.com/'