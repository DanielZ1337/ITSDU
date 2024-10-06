import { Skeleton } from "@/components/ui/skeleton";

export default function PersonRelationshipsListFallback() {
  return (
    <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
      <Skeleton className={"min-w-[40dvw] w-full h-4"} />
      <Skeleton className={"min-w-[40dvw] w-full h-4"} />
      <Skeleton className={"min-w-[40dvw] w-full h-4"} />
    </div>
  );
}
