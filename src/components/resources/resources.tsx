import RecursiveFileExplorer, {
  ResourceContextMenu,
  useDownloadToast,
} from "@/components/recursive-file-explorer.tsx";
import ErrorPage from "@/error-page.tsx";
import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources.ts";
import { File, FolderClosedIcon, FolderOpenIcon, MoreHorizontal } from "lucide-react";
import { Suspense, useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "@/styles/3-dots-loading.css";
import {
  isResourceFile,
  isSupportedResourceInApp,
  useNavigateToResource,
} from "@/types/api-types/extra/learning-tool-id-types";
import type { ItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource";
import { ItsolutionsItslUtilsConstantsElementType } from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType.ts";
import { useNavigate } from "react-router-dom";
import { ReactLoading } from "../react-loading-new/react-loading";
import { Highlight } from "../ui/hightlight";
import { useSearch } from "../ui/search-input";

type NestedItem = {
  [key: string]: boolean;
};

export default function Resources({ courseId }: { courseId: number }) {
  const { data } = useGETcourseRootResources(
    {
      courseId: courseId,
    },
    {
      suspense: true,
    },
  );

  const { value: searchValue } = useSearch();

  const [showNested, setShowNested] = useState<NestedItem>({});

  const toggleNested = (name: string | number) => {
    setShowNested({ ...showNested, [name]: !showNested[name] });
  };

  const navigateToResource = useNavigateToResource();

  const handleResourceNavigation = useCallback(
    (resource: ItslearningRestApiEntitiesPersonalCourseCourseResource) => {
      if (isSupportedResourceInApp(resource)) {
        navigateToResource(resource);
      } else {
        window.app.openExternal(resource.ContentUrl);
      }
    },
    [navigateToResource],
  );

  const handleArrowKey = useCallback(
    (keyPressed: string, treeKey: string | number) => {
      const nested = showNested[treeKey];

      if (keyPressed === "ArrowLeft") {
        if (nested) {
          toggleNested(treeKey);
        }
      }

      if (keyPressed === "ArrowRight") {
        if (!nested) {
          toggleNested(treeKey);
        }
      }
    },
    [showNested],
  );

  return (
    <div className={"block flex-wrap p-2 shrink-0"}>
      {data!.Resources.EntityArray.map((parent) => {
        return (
          <div key={parent.ElementId}>
            {/* rendering folders */}
            {/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
            {parent.ElementType ===
              ItsolutionsItslUtilsConstantsElementType[
                ItsolutionsItslUtilsConstantsElementType.Folder
              ] && (
              <button
                className={"inline-flex justify-center items-center pr-2"}
                onClick={() => toggleNested(parent.ElementId)}
                onKeyDown={(e) => handleArrowKey(e.key, parent.ElementId)}
              >
                {showNested[parent.ElementId] ? (
                  <FolderOpenIcon className={"shrink-0"} />
                ) : (
                  <FolderClosedIcon className={"shrink-0"} />
                )}
                <span className={"ml-2 text-left"}>
                  <Highlight highlight={searchValue} text={parent.Title} />
                </span>
              </button>
            )}
            {/* rendering files */}
            {/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
            {parent.ElementType !==
              ItsolutionsItslUtilsConstantsElementType[
                ItsolutionsItslUtilsConstantsElementType.Folder
              ] && (
              <ResourceContextMenu resource={parent}>
                <button
                  className={
                    "inline-flex gap-2 hover:underline  transition-all duration-200 hover:text-zinc-300 justify-center items-center pr-2"
                  }
                  onClick={() => handleResourceNavigation(parent)}
                  onKeyDown={(e) => handleArrowKey(e.key, parent.ElementId)}
                >
                  <File className={"shrink-0 inline-block"} />
                  <p className={"text-left"}>
                    <Highlight highlight={searchValue} text={parent.Title} />
                  </p>
                </button>
              </ResourceContextMenu>
            )}
            <ErrorBoundary fallback={<ErrorPage />}>
              <Suspense
                fallback={
                  <ReactLoading
                    className={"loading-dots -ml-0.5 -mt-2"}
                    height={30}
                    width={30}
                    type={"bubbles"}
                  />
                }
              >
                {showNested[parent.ElementId] && parent && (
                  <RecursiveFileExplorer
                    isOpen={showNested[parent.ElementId]}
                    courseId={courseId}
                    folderId={parent.ElementId}
                  />
                )}
              </Suspense>
            </ErrorBoundary>
          </div>
        );
      })}
    </div>
  );
}
