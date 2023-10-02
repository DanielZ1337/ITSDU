import {Suspense, useState} from "react";
// eslint-disable-next-line no-redeclare
import {File, FolderClosedIcon, FolderOpenIcon} from "lucide-react";
import useGETcourseFolderResources from "@/queries/courses/useGETcourseFolderResources.ts";
import {ErrorBoundary} from "react-error-boundary";
import ErrorPage from "@/error-page.tsx";

type NestedItem = {
    [key: string]: boolean
}

export default function RecursiveFileExplorer({courseId, folderId, isOpen}: {
    courseId: number,
    folderId: number,
    isOpen: boolean
}) {
    const [showNested, setShowNested] = useState<NestedItem>({})

    const {data} = useGETcourseFolderResources({
        courseId: courseId,
        folderId: folderId
    }, {
        suspense: true,
    })

    const toggleNested = (name: string | number) => {
        // @ts-ignore
        setShowNested({...showNested, [name]: !showNested[name]})
    }

    return (
        <div className={"ml-5"}>
            {data!.Resources.EntityArray.map((parent) => {
                return (
                    <div key={parent.ElementId}>
                        {/* rendering folders */}
                       <ErrorBoundary fallback={<ErrorPage/>}>
                           <Suspense fallback={<div>Loading...</div>}>
                               {/*@ts-ignore*/}
                               {parent.ElementType === 'Folder' &&
                                   <button className={"inline-flex"} onClick={() => toggleNested(parent.ElementId)}>
                                       {showNested[parent.ElementId] ? <FolderOpenIcon className={"shrink-0"}/> :
                                           <FolderClosedIcon className={"shrink-0"}/>}
                                       <span className={"ml-2 text-left"}>{parent.Title}<RecursiveFileExplorer
                                           courseId={courseId} folderId={parent.ElementId} isOpen={showNested[parent.ElementId]}/></span>
                                   </button>}
                           </Suspense>
                       </ErrorBoundary>
                        {/* rendering files */}
                        {/* @ts-ignore */}
                        {/*<div style={{display: !showNested[parent.ElementId] && 'none'}}>
                            {parent && <RecursiveFileExplorer courseId={courseId} folderId={parent.ElementId}/>}
                        </div>*/}
                        {/*@ts-ignore*/}
                        {isOpen && parent.ElementType !== 'Folder' && (
                            <button className={"inline-flex gap-2"}
                                    onClick={() => {
                                        window.download.start(parent.ElementId, 'test.pdf').then(() => {
                                            console.log('done')
                                        })
                                    }}
                               >
                                <File className={"shrink-0 inline-block"}/> {parent.Title}
                            </button>
                        )}
                    </div>
                    /*<div key={parent.ElementId}>
                        <pre>{JSON.stringify(parent, null, 2)}</pre>
                    </div>*/
                )
            })}
        </div>
    )
}