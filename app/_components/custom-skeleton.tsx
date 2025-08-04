import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function CustomSkeleton({
  width,
  height,
  className,
}: {
  width: string;
  height: string;
  className?: string;
}) {
  return <Skeleton className={cn(width, height, className)} />;
}
