import { atom } from "jotai"

const DEFAULT_PDF_RENDERER_OPTION = true
export const customPDFrendererAtom = atom<boolean>(DEFAULT_PDF_RENDERER_OPTION)