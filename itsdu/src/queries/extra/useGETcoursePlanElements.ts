import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TanstackKeys } from "@/types/tanstack-keys";

type ResponseObject = {
  title: string;
  date: {
    from: Date | null;
    to: Date | null;
  };
  description: string | null;
  resourcesAndActivities: ResourceActivityObject[];
};

type ResourceActivityObject = {
  planId: string | undefined;
  elementId: string | undefined;
  link: string | undefined;
  title: string | undefined;
  parentFolder: string | undefined;
  img: string | undefined;
};

export default function useGETcoursePlanElements(
  courseId: number | string,
  topicId: number | string,
  queryConfig?: UseQueryOptions<
    ResponseObject[],
    Error,
    ResponseObject[],
    string[]
  >
) {
  return useQuery({
    queryKey: [
      TanstackKeys.CoursePlanElements,
      String(courseId),
      String(topicId),
    ],
    queryFn: async () => {
      const mediaLink = (await window.resources.coursePlans.elements.get(
        courseId,
        topicId
      )) as ResponseObject[];

      if (!mediaLink) throw new Error("Media link not found");

      return mediaLink;
    },
    ...queryConfig,
  });
}
