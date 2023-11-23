import useResourceByElementID from '@/hooks/usePDFbyElementID'
import {Spinner} from '@nextui-org/spinner'
import {Suspense} from 'react'
import {useParams} from 'react-router-dom'
import AISidePanel from '@/components/ai-chat/ai-sidepanel'

export default function DocumentsOld() {
    const {elementId} = useParams()
    const {isLoading, data} = useResourceByElementID(elementId ?? '')

    return (
        <div className="flex flex-1 w-full h-full">
            {isLoading || !data ? (
                <Spinner size="lg" color="primary" label="Loading..." className={"m-auto w-full"}/>
            ) : (
                <iframe
                    src={data}
                    className="w-full h-full"
                    title="PDF"
                />
            )}
            <Suspense
                fallback={
                    <div className="flex flex-col flex-1 w-full h-full">
                        <div className="flex flex-row items-center justify-center flex-1 w-full h-full">
                            <Spinner size="lg" color="primary" label="Loading..." className={"m-auto w-full"}/>
                        </div>
                    </div>
                }
            >
                <AISidePanel elementId={elementId ?? ''}/>
            </Suspense>
        </div>
    )
}



