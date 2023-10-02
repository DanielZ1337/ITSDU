import {Suspense, useState} from "react";
// eslint-disable-next-line no-redeclare
import {File, FolderClosedIcon, FolderOpenIcon} from "lucide-react";
import useGETcourseFolderResources from "@/queries/courses/useGETcourseFolderResources.ts";
import {ErrorBoundary} from "react-error-boundary";
import ErrorPage from "@/error-page.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {LearningToolIdTypes} from "@/api-types/extra/learning-tool-id-types.ts";
import ReactLoading from "react-loading";

type NestedItem = {
    [key: string]: boolean
}

export default function RecursiveFileExplorer({courseId, folderId, isOpen}: {
    courseId: number,
    folderId: number,
    isOpen: boolean
}) {
    const [showNested, setShowNested] = useState<NestedItem>({})
    const {toast, dismiss} = useToast()

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
                            <Suspense
                                fallback={<ReactLoading className={"-mt-2"} height={20} width={20} type={"bubbles"}/>}>
                                {/*@ts-ignore*/}
                                {parent.ElementType === 'Folder' &&
                                    <button className={"inline-flex"} onClick={() => toggleNested(parent.ElementId)}>
                                        {showNested[parent.ElementId] ? <FolderOpenIcon className={"shrink-0"}/> :
                                            <FolderClosedIcon className={"shrink-0"}/>}
                                        <span className={"ml-2 text-left"}>{parent.Title}<RecursiveFileExplorer
                                            courseId={courseId} folderId={parent.ElementId}
                                            isOpen={showNested[parent.ElementId]}/></span>
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
                            parent.LearningToolId === LearningToolIdTypes.PDF ? (
                                <button className={"inline-flex gap-2"}
                                        onClick={async () => {
                                            toast({
                                                title: 'Downloading...',
                                                description: parent.Title,
                                                duration: 3000,
                                            })
                                            await window.itslearning_file_scraping.start(parent.ElementId, parent.Title)
                                            window.ipcRenderer.on('download:complete', (_, args) => {
                                                console.log(args)
                                                toast({
                                                    title: 'Downloaded',
                                                    description: parent.Title,
                                                    duration: 3000,
                                                    variant: 'success',
                                                    onClick: async () => {
                                                        await window.app.openShell(args)
                                                        dismiss()
                                                    }
                                                })
                                            })
                                            window.ipcRenderer.on('download:error', (_, args) => {
                                                console.log(args)
                                                toast({
                                                    title: 'Download error',
                                                    description: parent.Title,
                                                    duration: 3000,
                                                    variant: 'destructive'
                                                })
                                            })
                                        }}
                                >
                                    <File className={"shrink-0 inline-block"}/> {parent.Title}
                                </button>
                            ) : (
                                <div className={"inline-flex gap-2"}>
                                    <File className={"shrink-0 inline-block"}/> {parent.Title}
                                </div>
                            )
                        )}
                    </div>
                )
            })}
        </div>
    )
}