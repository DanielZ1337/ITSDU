import {Suspense, useState} from "react";
import {File, FolderClosedIcon, FolderOpenIcon} from "lucide-react";
import useGETcourseFolderResources from "@/queries/courses/useGETcourseFolderResources.ts";

type NestedItem = {
    [key: string]: boolean
}

export default function RecursiveFileExplorer({courseId, folderId}: { courseId: number, folderId: number }) {
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
                        <Suspense fallback={<div>Loading...</div>}>
                            {/*@ts-ignore*/}
                            {parent.ElementType === 'Folder' &&
                                <button className={"inline-flex"} onClick={() => toggleNested(parent.ElementId)}>
                                    {showNested[parent.ElementId] ? <FolderOpenIcon className={"shrink-0"}/> :
                                        <FolderClosedIcon className={"shrink-0"}/>}
                                    <span className={"ml-2 text-left"}>{parent.Title}<RecursiveFileExplorer
                                        courseId={courseId} folderId={parent.ElementId}/></span>
                                </button>}
                        </Suspense>
                        {/* rendering files */}
                        {/* @ts-ignore */}
                        {/*<div style={{display: !showNested[parent.ElementId] && 'none'}}>
                            {parent && <RecursiveFileExplorer courseId={courseId} folderId={parent.ElementId}/>}
                        </div>*/}
                        {/*@ts-ignore*/}
                        {parent.ElementType !== 'Folder' && (
                            <span className={"inline-flex gap-2"}>
                                <File className={"shrink-0 inline-block"}/> {parent.Title}
                            </span>
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