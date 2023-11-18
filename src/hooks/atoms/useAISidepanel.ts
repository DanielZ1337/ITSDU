import { aiSidepanelAtom } from "@/atoms/ai-sidepanel"
import { useAtom } from "jotai"

export const useAISidepanel = () => {
    const [aiSidepanel, setAISidepanel] = useAtom(aiSidepanelAtom)

    return { aiSidepanel, setAISidepanel }
}