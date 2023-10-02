import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources.ts";
import RecursiveFileExplorer from "@/components/recursive-file-explorer.tsx";
import {File, FolderClosedIcon, FolderOpenIcon} from "lucide-react";
import {Suspense, useState} from "react";
import ErrorPage from "@/error-page.tsx";
import {ErrorBoundary} from "react-error-boundary";

type NestedItem = {
    [key: string]: boolean
}


export default function Resources({courseId}: { courseId: number }) {
    const {data} = useGETcourseRootResources({
        courseId: courseId
    }, {
        suspense: true,
    })

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
                            <a className={"inline-flex gap-2"}
                               onClick={() => {
                                   
                               }}
                               >
                                <File className={"shrink-0 inline-block"}/> {parent.Title}
                            </a>
                        )}
                        <ErrorBoundary fallback={<ErrorPage/>}>
                            <Suspense fallback={<div>Loading...</div>}>
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
