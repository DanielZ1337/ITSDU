import {Suspense, useState} from "react";
// eslint-disable-next-line no-redeclare
import {File, FolderClosedIcon, FolderOpenIcon} from "lucide-react";
import useGETcourseFolderResources from "@/queries/courses/useGETcourseFolderResources.ts";
import {ErrorBoundary} from "react-error-boundary";
import ErrorPage from "@/error-page.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {LearningToolIdTypes} from "@/api-types/extra/learning-tool-id-types.ts";
import ReactLoading from "react-loading";
import '@/styles/3-dots-loading.css'

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
                                fallback={<ReactLoading className={"loading-dots -ml-0.5 -mt-2"} height={30} width={30}
                                                        type={"bubbles"}/>}>
                                {/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
                                {parent.ElementType === 'Folder' &&
                                    <button className={"inline-flex"} onClick={() => toggleNested(parent.ElementId)}>
                                        {showNested[parent.ElementId] ?
                                            (
                                                <FolderOpenIcon className={"shrink-0"}/>
                                            ) : (
                                                <FolderClosedIcon className={"shrink-0"}/>
                                            )
                                        }
                                        <span className={"ml-2 text-left"}>
                                            {parent.Title}
                                            <RecursiveFileExplorer courseId={courseId} folderId={parent.ElementId}
                                                                   isOpen={showNested[parent.ElementId]}/>
                                        </span>
                                    </button>
                                }
                            </Suspense>
                        </ErrorBoundary>
                        {/* rendering files */}
                        {/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
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
                                            window.ipcRenderer.once('download:complete', (_, args) => {
                                                console.log(args)
                                                toast({
                                                    title: 'Downloaded',
                                                    description: parent.Title,
                                                    duration: 3000,
                                                    variant: 'success',
                                                    onMouseDown: async () => {
                                                        // if the user clicks on the toast, open the file
                                                        // get the time that the mouse was pressed
                                                        const mouseDownTime = new Date().getTime()
                                                        // wait for the mouse to be released
                                                        await new Promise<void>((resolve) => {
                                                            window.addEventListener('mouseup', () => {
                                                                resolve()
                                                            }, {once: true})
                                                        })

                                                        // if the mouse was pressed for less than 500ms, open the file
                                                        if (new Date().getTime() - mouseDownTime < 100) {
                                                            console.log("Opening shell")
                                                            await window.app.openShell(args)
                                                            dismiss()
                                                        } else {
                                                            console.log("Not opening shell")
                                                        }
                                                    },
                                                })
                                            })
                                            window.ipcRenderer.once('download:error', (_, args) => {
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
                                    <div className={"inline-flex gap-2"}>
                                        <File className={"shrink-0 inline-block"}/>
                                        <p className={"text-left"}>{parent.Title}</p>
                                    </div>
                                </button>
                            ) : (
                                <div className={"inline-flex gap-2"}>
                                    <File className={"shrink-0 inline-block"}/>
                                    <p className={"text-left"}>{parent.Title}</p>
                                </div>
                            )
                        )}
                    </div>
                )
            })}
        </div>
    )
}