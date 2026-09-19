import { useAtom } from "jotai";
import { courseAtom } from "@/atoms/course";

export const useCourse = () => {
	const [courseId, setCourseId] = useAtom(courseAtom);

	return { courseId, setCourseId };
};
