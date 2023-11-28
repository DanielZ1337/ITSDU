import useResourceByElementID from '@/queries/resources/useResourceByElementID'
import {Spinner} from '@nextui-org/spinner'
import {Suspense} from 'react'
import {useParams} from 'react-router-dom'
import AISidePanel from '@/components/ai-chat/ai-sidepanel'

export default function DocumentsOld() {
    const {elementId} = useParams()
    const {isLoading, data} = useResourceByElementID(elementId ?? '')

    return (
        <div className="flex h-full w-full flex-1">
            {isLoading || !data ? (
                <Spinner size="lg" color="primary" label="Loading..." className={"m-auto w-full"}/>
            ) : (
                <iframe
                    src={data}
                    className="h-full w-full"
                    title="PDF"
                />
            )}
            <Suspense
                fallback={
                    <div className="flex h-full w-full flex-1 flex-col">
                        <div className="flex h-full w-full flex-1 flex-row items-center justify-center">
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



