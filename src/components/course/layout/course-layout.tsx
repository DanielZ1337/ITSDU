import CourseHeader from "@/components/course/layout/course-header.tsx";
import { useCourse } from "@/hooks/atoms/useCourse";
import { Suspense, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import CourseHeaderFallback from "./course-header-fallback";

export default function CourseLayout() {
  const { id } = useParams();
  const courseId = Number(id);
  const { setCourseId } = useCourse();

  useEffect(() => {
    setCourseId(courseId);
  }, [courseId, setCourseId]);

  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <div className="flex w-full flex-col overflow-hidden">
        <Suspense fallback={<CourseHeaderFallback />}>
          <CourseHeader courseId={courseId} />
        </Suspense>
        <div className="flex flex-1 flex-col overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
