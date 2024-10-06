import CourseCard from "@/components/course/course-card/course-card.tsx";
import useGETcourses from "@/queries/course-cards/useGETcourses.ts";
import { GETstarredCoursesParams } from "@/types/api-types/course-cards/GETstarredCourses.ts";
import { GETunstarredCoursesParams } from "@/types/api-types/course-cards/GETunstarredCourses.ts";
import { ClipboardList } from "lucide-react";

export default function CourseCards({
  config,
  courseCardTypes,
}: {
  courseCardTypes: "Starred" | "Unstarred" | "All";
  config: GETstarredCoursesParams | GETunstarredCoursesParams;
}) {
  const { data } = useGETcourses(
    courseCardTypes,
    {
      ...config,
    },
    {
      suspense: true,
    },
  );

  const starredCourses = data?.EntityArray.filter((course) => course.IsFavouriteCourse);
  const unstarredCourses = data?.EntityArray.filter(
    (course) => !course.IsFavouriteCourse,
  );

  if (data?.EntityArray.length === 0) {
    return (
      <div className={"flex flex-col w-5/6 sm:w-72 h-36 m-40"}>
        <div className={"flex flex-col w-full h-full p-4 justify-center items-center"}>
          <span
            className={
              "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
            }
          >
            <ClipboardList /> No courses
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={"flex flex-wrap gap-4 justify-center"}>
      {courseCardTypes === "Starred" && starredCourses?.length === 0 && (
        <div className={"flex flex-col w-5/6 sm:w-72 h-36 m-40"}>
          <div className={"flex flex-col w-full h-full p-4 justify-center items-center"}>
            <span
              className={
                "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
              }
            >
              <ClipboardList /> No starred courses
            </span>
          </div>
        </div>
      )}
      {courseCardTypes === "Starred" && starredCourses?.length !== 0 && (
        <div className={"flex flex-col w-full gap-4"}>
          <h1
            className={
              "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
            }
          >
            Starred courses
          </h1>
          <div className={"flex flex-wrap gap-4 justify-center"}>
            {starredCourses?.map((course) => (
              <CourseCard key={course.CourseId} card={course} />
            ))}
          </div>
        </div>
      )}

      {courseCardTypes === "Unstarred" && unstarredCourses?.length !== 0 && (
        <div className={"flex flex-col w-full gap-4"}>
          <h1
            className={
              "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
            }
          >
            Unstarred courses
          </h1>
          <div className={"flex flex-wrap gap-4 justify-center"}>
            {unstarredCourses?.map((course) => (
              <CourseCard key={course.CourseId} card={course} />
            ))}
          </div>
        </div>
      )}
      {courseCardTypes === "Unstarred" && unstarredCourses?.length === 0 && (
        <div className={"flex flex-col w-5/6 sm:w-72 h-36 m-40"}>
          <div className={"flex flex-col w-full h-full p-4 justify-center items-center"}>
            <span
              className={
                "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
              }
            >
              <ClipboardList /> No unstarred courses
            </span>
          </div>
        </div>
      )}

      {courseCardTypes === "All" && data?.EntityArray.length === 0 && (
        <div className={"flex flex-col w-5/6 sm:w-72 h-36 m-40"}>
          <div className={"flex flex-col w-full h-full p-4 justify-center items-center"}>
            <span
              className={
                "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
              }
            >
              <ClipboardList /> No courses
            </span>
          </div>
        </div>
      )}
      {courseCardTypes === "All" && data?.EntityArray.length !== 0 && (
        <div className={"flex flex-col w-full gap-4"}>
          <div className={"flex flex-wrap gap-4 justify-center"}>
            {starredCourses?.length !== 0 && (
              <div className={"flex flex-col w-full gap-4 lg:gap-6"}>
                <h2
                  className={
                    "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-tighter"
                  }
                >
                  Starred courses
                </h2>
                <div className={"flex flex-wrap gap-4 justify-center"}>
                  {starredCourses?.map((course) => (
                    <CourseCard key={course.CourseId} card={course} />
                  ))}
                </div>
              </div>
            )}
            {unstarredCourses?.length !== 0 && (
              <div className={"flex flex-col w-full gap-4 lg:gap-6"}>
                <h2
                  className={
                    "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-tighter"
                  }
                >
                  Unstarred courses
                </h2>
                <div className={"flex flex-wrap gap-4 justify-center"}>
                  {unstarredCourses?.map((course) => (
                    <CourseCard key={course.CourseId} card={course} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
