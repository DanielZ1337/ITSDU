import {GETcurrentUser} from "@/types/api-types/person/GETcurrentUser.ts";
import { atom} from 'jotai'

export const userAtom = atom<GETcurrentUser | null>(null)