import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/app/dashboard/destinations/_components/table-pagination";
import { MapPin, Heart, Bookmark } from "lucide-react";
import { DestinationRequest } from "@/lib/request/destination.request";
import { DestinationType } from "@/lib/types";

interface DestinationsTableProps {
  page: number;
  pageSize: number;
  title?: string;
}

export async function DestinationsTable({
  page,
  pageSize,
}: DestinationsTableProps) {
  const data = await DestinationRequest.GETS(page, pageSize);
  const { data: destinations, pagination } = data;

  return (
    <div className="flex flex-col justify-start items-stretch gap-4">
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    "No destinations found"
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              destinations.map((destination: DestinationType) => (
                <TableRow key={destination.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{destination.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1 whitespace-pre-wrap">
                        {destination.content}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {destination.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{destination.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {destination.tags.map((tag) => (
                        <Badge
                          key={tag.slug}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {destination.price === 0 ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      <span className="font-medium">
                        ${destination.price?.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {destination._count.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        {destination._count.bookmarks}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(destination.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
        />
      </div>
    </div>
  );
}
