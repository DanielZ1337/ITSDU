import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources.ts";
import RecursiveFileExplorer from "@/components/recursive-file-explorer.tsx";
import {File, FolderClosedIcon, FolderOpenIcon} from "lucide-react";
import {Suspense, useState} from "react";
import ErrorPage from "@/error-page.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {useToast} from "@/components/ui/use-toast.ts";
import {LearningToolIdTypes} from "@/api-types/extra/learning-tool-id-types.ts";
import ReactLoading from "react-loading";

type NestedItem = {
    [key: string]: boolean
}


export default function Resources({courseId}: { courseId: number }) {
    const {data} = useGETcourseRootResources({
        courseId: courseId
    }, {
        suspense: true,
    })

    const {toast, dismiss} = useToast()

    const [showNested, setShowNested] = useState<NestedItem>({})

    const toggleNested = (name: string | number) => {
        // @ts-ignore
        setShowNested({...showNested, [name]: !showNested[name]})
    }

    return (
        <div>
            {data!.Resources.EntityArray.map((parent) => {
                return (
                    <div key={parent.ElementId} className={""}>
                        {/* rendering folders */}
                        {/*@ts-ignore*/}
                        {parent.ElementType === 'Folder' &&
                            <button className={"inline-flex"} onClick={() => toggleNested(parent.ElementId)}>
                                {showNested[parent.ElementId] ? <FolderOpenIcon className={"shrink-0"}/> :
                                    <FolderClosedIcon className={"shrink-0"}/>}
                                <span className={"ml-2 text-left"}>{parent.Title}</span>
                            </button>}
                        {/* rendering files */}
                        {/*@ts-ignore*/}
                        {parent.ElementType !== 'Folder' && (
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
                                        }}>
                                    <File className={"shrink-0 inline-block"}/> {parent.Title}
                                </button>
                            ) : (
                                <div className={"inline-flex gap-2"}>
                                    <File className={"shrink-0 inline-block"}/> {parent.Title}
                                </div>
                            )
                        )}
                        <ErrorBoundary fallback={<ErrorPage/>}>
                            <Suspense
                                fallback={<ReactLoading className={"-mt-2"} height={20} width={20} type={"bubbles"}/>}>
                                {showNested[parent.ElementId] && parent &&
                                    <RecursiveFileExplorer isOpen={showNested[parent.ElementId]} courseId={courseId}
                                                           folderId={parent.ElementId}/>}
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                )
            })}
        </div>
    )
}
/*


const FolderItem = ({folder, onItemClick}: { folder: any, onItemClick: any }) => {
    const handleItemClick = () => {
        onItemClick(folder);
    };

    return (
        <div>
      <span onClick={handleItemClick} style={{cursor: 'pointer'}}>
        {folder.Title}
      </span>
        </div>
    );
};

const FileItem = ({file}: { file: any }) => {
    return <div>{file.Title}</div>;
};*/
