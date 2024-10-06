import { courseAtom } from "@/atoms/course";
import { useAtom } from "jotai";

export const useCourse = () => {
	const [courseId, setCourseId] = useAtom(courseAtom);

	return { courseId, setCourseId };
};
