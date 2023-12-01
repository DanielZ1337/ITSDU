import { Loader } from '@/components/ui/loader'
import React, { useState, useEffect } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

type MediaDocumentType = 'video' | 'image'

export default function MediaDocuments() {
    const { elementId } = useParams()
    const location = useLocation()
    if (!elementId || !location.state) {
        throw new Error('Invalid ID or state')
    }

    const { type } = location.state as { type: MediaDocumentType }

    if (!type || (type !== 'video' && type !== 'image')) {
        throw new Error('Invalid type')
    }

    const [objectSrc, setObjectSrc] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const getObjectSrc = async () => {
            const objectSrc = await window.resources.media.get(elementId)
            setObjectSrc(objectSrc)
            setIsLoading(false)
        }
        getObjectSrc()
    }, [])

    const Comp = type === 'video' ? 'video' : 'img'

    return (
        <div className='m-auto flex h-fit max-h-full max-w-full flex-col items-center justify-center p-6'>
            <div
                className="m-auto flex max-h-full flex-col items-center justify-center rounded-md p-4 ring ring-purple-500/50 bg-foreground/10">
                <div
                    className="m-auto flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md">
                    {isLoading || !objectSrc ? <div className="flex h-full items-center justify-center">
                        <Loader size={"md"} className={"m-auto"} /></div> : <Comp src={objectSrc} {...(type === 'video' && { autoPlay: true, controls: true })} className="object-contain m-auto flex h-full w-full items-center justify-center" />}
                </div>
            </div>
        </div>
    )
}