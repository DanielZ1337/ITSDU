import PersonRelationshipsListFallback from "@/components/person/fallback/person-relationships-list-fallback";
import PersonRelationshipsPersonInfoFallback from "@/components/person/fallback/person-relationships-person-info-fallback";
import { PersonInfo } from "@/components/person/person-info.tsx";
import { PersonRelationships } from "@/components/person/person-relationships.tsx";
import { Suspense } from "react";
import { useParams } from "react-router-dom";

export default function PersonIndex() {
	const params = useParams();
	const personId = Number(params.id);

	return (
		<div className="flex flex-1 items-center justify-center p-4">
			<div className="flex flex-col overflow-hidden rounded-lg p-8 shadow-lg bg-foreground/10 shadow-foreground/5">
				<Suspense fallback={<PersonRelationshipsPersonInfoFallback />}>
					<PersonInfo personId={personId} />
				</Suspense>
				<div className={"h-0.5 w-full bg-foreground/10 my-6"} />
				<Suspense fallback={<PersonRelationshipsListFallback />}>
					<PersonRelationships personId={personId} />
				</Suspense>
			</div>
		</div>
	);
}
