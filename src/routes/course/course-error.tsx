import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function CourseError() {
	const navigate = useNavigate();

	return (
		<div className={"m-auto"}>
			<Helmet>
				<title>Course not found</title>
			</Helmet>
			<div className={"flex flex-col gap-4 w-full p-4 items-center"}>
				<p className={"text-3xl font-bold text-balance"}>Course not found</p>
				<Button variant={"secondary"} size={"lg"} onClick={() => navigate(-1)}>
					Go back
				</Button>
			</div>
		</div>
	);
}
