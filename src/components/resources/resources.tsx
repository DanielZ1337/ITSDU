import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources.ts";
import RecursiveFileExplorer from "@/components/recursive-file-explorer.tsx";
// eslint-disable-next-line no-redeclare
import { File, FolderClosedIcon, FolderOpenIcon } from "lucide-react";
import { Suspense, useState } from "react";
import ErrorPage from "@/error-page.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { useToast } from "@/components/ui/use-toast.ts";
import ReactLoading from "react-loading";
import '@/styles/3-dots-loading.css'
import {
    ItsolutionsItslUtilsConstantsElementType
} from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType.ts";
import { isResourceFile } from "@/types/api-types/extra/learning-tool-id-types";

type NestedItem = {
    [key: string]: boolean
}

export default function Resources({ courseId }: {
    courseId: number
}) {
    const { data } = useGETcourseRootResources({
        courseId: courseId
    }, {
        suspense: true,
    })

    const { toast, dismiss } = useToast()

    const [showNested, setShowNested] = useState<NestedItem>({})

    const toggleNested = (name: string | number) => {
        setShowNested({ ...showNested, [name]: !showNested[name] })
    }

    return (
        <div className={"block flex-wrap p-2"}>
            {data!.Resources.EntityArray.map((parent) => {
                return (
                    <div key={parent.ElementId} className={""}>
                        {/* rendering folders */}
                        {/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
                        {parent.ElementType === ItsolutionsItslUtilsConstantsElementType[ItsolutionsItslUtilsConstantsElementType.Folder] &&
                            <button className={"inline-flex"} onClick={() => toggleNested(parent.ElementId)}>
                                {showNested[parent.ElementId] ? <FolderOpenIcon className={"shrink-0"} /> :
                                    <FolderClosedIcon className={"shrink-0"} />}
                                <span className={"ml-2 text-left"}>{parent.Title}</span>
                            </button>}
                        {/* rendering files */}
                        {/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
                        {parent.ElementType !== ItsolutionsItslUtilsConstantsElementType[ItsolutionsItslUtilsConstantsElementType.Folder] && (
                            isResourceFile(parent) ? (
                                <button className={"inline-flex gap-2"}
                                    onClick={async () => {
                                        toast({
                                            title: 'Downloading...',
                                            description: parent.Title,
                                            duration: 3000,
                                        })
                                        await window.download.start(parent.ElementId, parent.Title)
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
                                                        }, { once: true })
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
                                    }}>
                                    <File className={"shrink-0 inline-block"} />
                                    <p className={"text-left"}>{parent.Title}</p>
                                </button>
                            ) : (
                                <div className={"inline-flex gap-2"}>
                                    <File className={"shrink-0 inline-block"} />
                                    <p className={"text-left"}>{parent.Title}</p>
                                </div>
                            )
                        )}
                        <ErrorBoundary fallback={<ErrorPage />}>
                            <Suspense
                                fallback={<ReactLoading className={"loading-dots -ml-0.5 -mt-2"} height={30} width={30}
                                    type={"bubbles"} />}>
                                {showNested[parent.ElementId] && parent &&
                                    <RecursiveFileExplorer isOpen={showNested[parent.ElementId]} courseId={courseId}
                                        folderId={parent.ElementId} />}
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                )
            })}
        </div>
    )
}