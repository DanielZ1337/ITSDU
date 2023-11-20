import { useEffect, useState } from 'react'

export default function usePDFbyElementID(elementId: number | string) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pdf, setPdf] = useState<Blob | null>(null)
    const [src, setSrc] = useState<string | undefined>(undefined)

    useEffect(() => {
        const getPDFbyElementID = async () => {
            setIsLoading(true)
            await new Promise(resolve => setTimeout(resolve, 1000))
            const arraybuffer = await window.blob.get(elementId)
            const blob = new Blob([arraybuffer], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            setPdf(blob)
            setSrc(url)
            setIsLoading(false)
        }

        getPDFbyElementID()
    }, [])

    return { isLoading, pdf, src }
}
