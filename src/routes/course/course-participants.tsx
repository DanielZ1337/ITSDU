import CourseParticipantsList from "@/components/course/course-participants-list";
import {Input} from "@/components/ui/input";
import {Suspense, useState} from "react";
import {useParams} from "react-router-dom";

export default function CourseParticipants() {
    const [searchTerm, setSearchTerm] = useState("");
    const params = useParams();
    const courseId = Number(params.id)

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Course Participants</h1>
            <div className="flex items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search participants"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 mr-2"
                />
            </div>
            <Suspense fallback={<span className={"px-1"}>Loading participants...</span>}>
                <CourseParticipantsList searchTerm={searchTerm} courseId={courseId}/>
            </Suspense>
        </div>
    );
}