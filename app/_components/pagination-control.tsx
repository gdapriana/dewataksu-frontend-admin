import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  nextCursor?: string | null;
}

export function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
  nextCursor,
}: PaginationControlsProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = !!nextCursor;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button asChild variant="outline" disabled={!hasPreviousPage}>
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className={!hasPreviousPage ? "pointer-events-none" : ""}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Link>
      </Button>

      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <Button asChild variant="outline" disabled={!hasNextPage}>
        <Link
          href={`${baseUrl}?cursor=${nextCursor}`}
          className={!hasNextPage ? "pointer-events-none" : ""}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
