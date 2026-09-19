import { useNavigate } from "react-router-dom";
import { TabTitle } from "@/components/tabs/tab-manager";
import { Button } from "@/components/ui/button";

export default function CourseAnnouncementError() {
	const navigate = useNavigate();

	return (
		<div className="m-auto">
			<TabTitle>Course Announcement Error</TabTitle>
			<div className="flex w-full flex-col items-center gap-4 p-4">
				<p className="text-3xl font-bold text-balance">
					Course Announcement Error
				</p>
				<Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
					Go back
				</Button>
			</div>
		</div>
	);
}
