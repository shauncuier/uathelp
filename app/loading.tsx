import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-12 animate-pulse items-center justify-center rounded-xl bg-brand/10">
          <div className="size-6 rounded-md bg-brand/30" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}
