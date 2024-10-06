import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function CourseAnnouncementError() {
	const navigate = useNavigate();

	return (
		<div className="m-auto">
			<Helmet>
				<title>Course Announcement Error</title>
			</Helmet>
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
