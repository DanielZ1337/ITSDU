import { Skeleton } from "@/components/ui/skeleton";

export default function PersonRelationshipsPersonInfoFallback() {
  return (
    <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
      <div className="px-4 py-2 space-y-4">
        <Skeleton className={"min-w-[40dvw] w-full h-4"} />
        <Skeleton className={"mx-auto min-w-[30dvw] w-1/3 h-4"} />
      </div>
      <Skeleton className={"h-32 w-32 rounded-full"} />
    </div>
  );
}
